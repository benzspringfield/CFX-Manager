#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
CFX Manager — engine (ดึง consensus/ราคา/มหภาค อัตโนมัติ)
เขียนผลลง public/data/live/consensus.json + macro.json ให้ React overlay
ใช้ stdlib ล้วน (urllib) — ไม่ต้อง pip install

รัน:  python engine/cfx_engine.py
แหล่ง (ตามไฟล์กฎที่อนุมัติ): Finviz (US) · FRED (มหภาค) · Settrade (TH — ต้องใช้ API endpoint, ดู TODO)
"""
import json, os, re, time, urllib.request, http.cookiejar
from datetime import date

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
BASE = os.path.join(ROOT, "public", "data", "daily", "2026-07-01.json")
LIVE = os.path.join(ROOT, "public", "data", "live")
UA = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0 Safari/537.36"}


def get(url, timeout=20):
    req = urllib.request.Request(url, headers=UA)
    with urllib.request.urlopen(req, timeout=timeout) as r:
        return r.read().decode("utf-8", "replace")


# ── Settrade (TH) : ต้องผ่าน Incapsula WAF — โหลดหน้าเก็บ cookie ก่อน แล้วเรียก API ──
def settrade_opener():
    jar = http.cookiejar.CookieJar()
    op = urllib.request.build_opener(urllib.request.HTTPCookieProcessor(jar))
    op.addheaders = [("User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/125.0 Safari/537.36"),
                     ("Accept", "application/json"), ("Accept-Language", "th,en;q=0.9")]
    op.open("https://www.settrade.com/th/equities/quote/PTTEP/analyst-consensus", timeout=25).read()  # prime cookie
    return op


def settrade(tk, op):
    url = "https://www.settrade.com/api/set-fund/consensus/stock/overall?symbol=" + tk
    d = json.loads(op.open(urllib.request.Request(url, headers={"Referer": "https://www.settrade.com/th/equities/quote/" + tk + "/analyst-consensus"}), timeout=15).read().decode("utf-8", "replace"))
    ov = (d.get("overall") or [None])[0]
    if not ov:
        return None
    rt = (ov.get("recommendType") or "").capitalize() or "n/a"
    return {"src": "st", "cur": "฿", "rating": rt, "n": ov.get("totalCoverage"),
            "b": ov.get("buy"), "h": ov.get("hold"), "s": ov.get("sell"),
            "tgt": round(ov.get("averageTargetPrice") or 0, 2),
            "bull": round(ov.get("bullish") or 0, 1)}


# ── Finviz : parser ทั่วไป (label → value) จาก snapshot table ──
def finviz_snapshot(tk):
    html = get("https://finviz.com/quote.ashx?t=" + tk.replace(".", "-"))
    out = {}
    for m in re.finditer(
        r'snapshot-td-label">(?:<a[^>]*>)?([^<]+?)(?:</a>)?</div>.*?'
        r'snapshot-td-content">(?:<a[^>]*>)?<b>(?:<span[^>]*>)?([^<]+)',
        html, re.DOTALL):
        out[m.group(1).strip()] = m.group(2).strip()
    return out

def fvf(d, label):
    v = d.get(label)
    if not v:
        return None
    v = v.replace("%", "").replace("+", "").replace(",", "").replace("$", "").strip()
    try:
        return float(v)
    except ValueError:
        return None

# US consensus : Target Price + Recom (1=Strong Buy .. 5=Strong Sell)
def finviz(tk):
    s = finviz_snapshot(tk)
    tgt, recom = fvf(s, "Target Price"), fvf(s, "Recom")
    if tgt is None and recom is None:
        return None
    return {"src": "fv", "cur": "$", "recom": recom, "tgt": tgt}


# ── FRED (มหภาค) : CPI YoY, 10Y, Fed Funds ──
def fred_series(sid, cosd="2025-01-01"):
    csv = get(f"https://fred.stlouisfed.org/graph/fredgraph.csv?id={sid}&cosd={cosd}")
    rows = [r.split(",") for r in csv.strip().splitlines()[1:] if r and not r.endswith(",.")]
    return [(d, float(v)) for d, v in rows if v not in ("", ".")]


# ── Live FACTS (รายวัน) — Finviz-first (FRED/Stooq ถูกบล็อกบางเครือข่าย) ──
# cache snapshot กันยิงซ้ำ (scores/bb/tripwire/regime ใช้ ticker ทับกัน)
_SNAP = {}
def snap(tk):
    if tk not in _SNAP:
        try:
            _SNAP[tk] = finviz_snapshot(tk); time.sleep(0.35)
        except Exception as e:
            print(f"  snap {tk} fail: {e}"); _SNAP[tk] = {}
    return _SNAP[tk]

def scores():
    etf = {"oil": "USO", "commodities": "DBC", "SPX": "SPY", "gold": "GLD", "US$": "UUP",
           "HY": "HYG", "IG": "LQD", "govt": "IEF", "EM": "EEM", "bitcoin": "BITO"}
    out = {}
    for k, tk in etf.items():
        v = fvf(snap(tk), "Perf YTD")
        if v is not None:
            out[k] = v
    return out

def tripwire_status():
    tw = []
    def add(label, val, op, lvl, meaning, approx=False):
        hit = None
        if val is not None:
            hit = (val < lvl) if op == "<" else (val > lvl)
        tw.append({"label": label, "level": ("< " if op == "<" else "> ") + str(lvl),
                   "value": (round(val, 2) if val is not None else None),
                   "triggered": bool(hit), "approx": approx, "meaning": meaning})
    mags = fvf(snap("MAGS"), "Price")
    gld = fvf(snap("GLD"), "Price")
    gold_imp = round(gld * 10.85, 0) if gld else None  # GLD ≈ spot/10.85
    dgs30 = None
    try:
        dgs30 = fred_series("DGS30", "2026-05-01")[-1][1]  # ได้เมื่อรันบน Actions
    except Exception:
        pass
    add("MAGS", mags, "<", 60, "mega-cap AI นำลง → summer risk-off")
    add("30Y UST", dgs30, ">", 5, "bond vigilantes → booms end (ต้องใช้ FRED/Actions)")
    add("Gold", gold_imp, "<", 4000, "จุดเข้า ('USD a rent') — ประเมินจาก GLD", approx=True)
    return tw

def _sma_to_score(x):  # % เหนือ/ใต้ 200DMA → 0-100 (เหนือ = greedy)
    return None if x is None else max(0, min(100, 50 + x * 4))

def bb_proxy():
    # composite 0-10 : SPY/HYG/RSP เทียบ SMA200 (momentum·credit·breadth) จาก Finviz
    parts, comp = {}, []
    for tk, key in (("SPY", "momentum"), ("HYG", "credit"), ("RSP", "breadth")):
        x = fvf(snap(tk), "SMA200")
        sc = _sma_to_score(x)
        if sc is not None:
            comp.append(sc); parts[key] = x
    if not comp:
        return None
    return {"value": round(sum(comp) / len(comp) / 10.0, 1),
            "note": "proxy composite (SPY·HYG·RSP เทียบ 200DMA จาก Finviz) — ไม่ใช่ BofA B&B จริง",
            "parts": parts}

def regime_box():
    # Growth × Inflation 4-box : DBC (เงินเฟ้อ) × XLI vs XLP (cyclical/defensive) — Finviz proxy
    dbc = fvf(snap("DBC"), "Perf YTD")
    xli = fvf(snap("XLI"), "Perf YTD")
    xlp = fvf(snap("XLP"), "Perf YTD")
    hi_infl = (dbc is not None and dbc >= 3)
    growth_up = (xli is not None and xlp is not None and xli >= xlp)
    if xli is None or xlp is None:
        growth_up = True  # default risk-on
    name = ("Reflation" if (growth_up and hi_infl) else "Goldilocks" if (growth_up and not hi_infl)
            else "Stagflation" if (not growth_up and hi_infl) else "Deflation")
    order = ["Goldilocks", "Reflation", "Deflation", "Stagflation"]
    box = [(x + " ●") if x == name else x for x in order]  # ● marks active (faBodyHTML keys on it)
    return {"name": name, "box": box, "parts": {"DBC": dbc, "XLI": xli, "XLP": xlp}}


def macro():
    out = {"asof": str(date.today())}
    try:
        cpi = fred_series("CPIAUCSL", "2024-06-01")
        if len(cpi) >= 13:
            yoy = (cpi[-1][1] / cpi[-13][1] - 1) * 100
            out["cpi"] = f"{yoy:.2f}%"
    except Exception as e:
        print("  CPI fail:", e)
    for key, sid in (("dgs10", "DGS10"), ("fed", "FEDFUNDS")):
        try:
            s = fred_series(sid, "2026-05-01")
            if s:
                out[key] = f"{s[-1][1]:.2f}"
        except Exception as e:
            print(f"  {sid} fail:", e)
    return out


def main():
    os.makedirs(LIVE, exist_ok=True)
    base = json.load(open(BASE, encoding="utf-8"))
    cons = dict(base.get("consensus", {}))  # เริ่มจาก seed (TH/HK คงไว้)

    # US via Finviz
    us = [tk for tk, c in cons.items() if c.get("src") == "fv"]
    print(f"[Finviz] refreshing {len(us)} US tickers…")
    for tk in us:
        try:
            r = finviz(tk)
            if r:
                cons[tk] = r
                print(f"  {tk}: tgt={r['tgt']} recom={r['recom']}")
            time.sleep(0.4)
        except Exception as e:
            print(f"  {tk} fail: {e} (keep seed)")

    # TH via Settrade (ผ่าน Incapsula cookie)
    th = [tk for tk, c in cons.items() if c.get("src") == "st"]
    print(f"[Settrade] refreshing {len(th)} TH tickers…")
    try:
        op = settrade_opener()
        for tk in th:
            try:
                r = settrade(tk, op)
                if r:
                    cons[tk] = r
                    print(f"  {tk}: {r['rating']} n={r['n']} tgt={r['tgt']} bull={r['bull']}%")
                time.sleep(0.3)
            except Exception as e:
                print(f"  {tk} fail: {e} (keep seed)")
    except Exception as e:
        print(f"  Settrade WAF/cookie prime fail: {e} (keep TH seed)")

    json.dump(cons, open(os.path.join(LIVE, "consensus.json"), "w", encoding="utf-8"),
              ensure_ascii=False, indent=1)
    print(f"[write] public/data/live/consensus.json ({len(cons)} entries)")

    print("[FRED] fetching macro…")
    m = macro()
    json.dump(m, open(os.path.join(LIVE, "macro.json"), "w", encoding="utf-8"),
              ensure_ascii=False, indent=1)
    print("[write] public/data/live/macro.json", m)

    # ── live FACTS → market.json (Scores YTD · Tripwire · Regime · B&B proxy) ──
    print("[facts] scores / tripwire / regime / B&B proxy…")
    import datetime as _dt
    mkt = {"asof": _dt.datetime.now().strftime("%Y-%m-%d %H:%M")}
    try: mkt["scores"] = scores()
    except Exception as e: print("  scores fail:", e)
    try: mkt["tripwires"] = tripwire_status()
    except Exception as e: print("  tripwire fail:", e)
    try: mkt["regime"] = regime_box()
    except Exception as e: print("  regime fail:", e)
    try: mkt["bullBear"] = bb_proxy()
    except Exception as e: print("  bb fail:", e)
    json.dump(mkt, open(os.path.join(LIVE, "market.json"), "w", encoding="utf-8"),
              ensure_ascii=False, indent=1)
    _rg = (mkt.get("regime") or {}).get("name")
    _bb = (mkt.get("bullBear") or {}).get("value")
    print(f"[write] public/data/live/market.json  regime={_rg} bb={_bb}")

    # ✅ TH: Settrade /api/set-fund/consensus/stock/overall (ผ่าน Incapsula cookie) — auto แล้ว
    # ✅ US: Finviz snapshot (throttle ถ้ายิงถี่ — รันวันละครั้งไม่โดน)
    # TODO(HK/JP): Yahoo/Morningstar บล็อก scraping → ใช้ provider ที่มี API key (EOD Historical / FMP)
    print("done.")


if __name__ == "__main__":
    main()
