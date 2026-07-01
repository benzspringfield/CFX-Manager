#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
cfx_stock.py — วิเคราะห์หุ้นรายตัว (instant card) จาก ticker ที่ผู้ใช้พิมพ์
  US : Finviz snapshot (ราคา/PE/PEG/D-E/ROE/target/recom/perf) + ธง Amorn/JRT อัตโนมัติ
  TH : Settrade consensus (rating/target/coverage/bullish) — fundamentals ดูหน้า Settrade

ใช้:  python engine/cfx_stock.py NVDA us
      python engine/cfx_stock.py PTT th
เขียน: public/data/stocks/<TICKER>.json  (แอปโหลดไปแสดง)

ส่วน 'instant' = data + กฎ · ส่วน 'บทวิเคราะห์เต็ม AI' เติมภายหลังผ่าน Claude (--deep flag ในสกิล)
"""
import json, os, sys, datetime
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from cfx_engine import finviz_snapshot, fvf, settrade, settrade_opener  # reuse

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
# เขียน 2 ที่: public/data (React) + data (preview.html top-level)
OUT_DIRS = [os.path.join(ROOT, "public", "data", "stocks"), os.path.join(ROOT, "data", "stocks")]


def flag(ok, text):
    return {"ok": bool(ok), "text": text}


def analyze_us(tk):
    s = finviz_snapshot(tk)
    if not s:
        return None
    price = fvf(s, "Price")
    pe = fvf(s, "P/E")
    fwdpe = fvf(s, "Forward P/E")
    peg = fvf(s, "PEG")
    de = fvf(s, "Debt/Eq")
    roe = fvf(s, "ROE")
    tgt = fvf(s, "Target Price")
    recom = fvf(s, "Recom")
    perf = fvf(s, "Perf YTD")
    eps_ny = fvf(s, "EPS next Y")   # % growth
    sma200 = fvf(s, "SMA200")
    div = fvf(s, "Dividend %") or fvf(s, "Dividend TTM")
    upside = round((tgt / price - 1) * 100, 1) if (tgt and price) else None
    rating = ("Strong Buy" if recom and recom < 1.5 else "Buy" if recom and recom < 2.5
              else "Hold" if recom and recom < 3.5 else "Sell" if recom else "n/a")

    # ธง Amorn/JRT อัตโนมัติ (rule-based)
    flags = [
        flag(de is not None and de <= 2, "D/E ≤ 2 (Amorn: หนี้ไม่สูงเกิน)" + (f" — {de}" if de is not None else " — n/a")),
        flag(peg is not None and 0 < peg <= 1.5, "PEG ≤ 1.5 (ราคาเทียบการเติบโตสมเหตุผล)" + (f" — {peg}" if peg is not None else " — n/a")),
        flag(pe is not None and 0 < pe <= 25, "P/E ≤ 25 (ไม่แพงเกิน)" + (f" — {pe}" if pe is not None else " — n/a")),
        flag(upside is not None and upside >= 10, "Upside ≥ 10% ถึงเป้า consensus" + (f" — {upside}%" if upside is not None else "")),
        flag(roe is not None and roe >= 12, "ROE ≥ 12% (คุณภาพกำไร)" + (f" — {roe}%" if roe is not None else " — n/a")),
        flag(sma200 is not None and sma200 > 0, "ยืนเหนือ 200DMA (แนวโน้มขึ้น)" + (f" — {sma200}%" if sma200 is not None else "")),
    ]
    passed = sum(1 for f in flags if f["ok"])
    verdict = ("ผ่านเกณฑ์ VI ส่วนใหญ่" if passed >= 4 else "ผ่านบางเกณฑ์ — พิจารณาเพิ่ม" if passed >= 2
               else "ไม่ผ่านเกณฑ์ VI หลายข้อ — ระวัง")
    return {
        "tk": tk.upper(), "mkt": "US", "generated": True,
        "asof": datetime.datetime.now().strftime("%Y-%m-%d %H:%M"),
        "cur": "$", "name": s.get("Company") or tk.upper(),
        "live": {"price": price, "pe": pe, "fwdpe": fwdpe, "peg": peg, "de": de, "roe": roe,
                 "div": div, "perfYtd": perf, "epsNextY": eps_ny, "sma200": sma200,
                 "target": tgt, "upside": upside, "recom": recom, "rating": rating},
        "flags": flags, "passed": passed, "verdict": verdict,
        "research": {"label": "Finviz (" + tk.upper() + ")", "url": "https://finviz.com/quote.ashx?t=" + tk.upper().replace(".", "-")},
        "note": "instant card (ข้อมูล+กฎอัตโนมัติ) · บทวิเคราะห์เต็มเชิงคุณภาพเติมด้วย AI ได้",
    }


def analyze_th(tk):
    try:
        op = settrade_opener()
        c = settrade(tk.upper(), op)
    except Exception as e:
        print("settrade fail:", e); c = None
    if not c:
        return None
    upside = None  # ไม่มีราคาปัจจุบันจาก consensus API
    flags = [
        flag("Buy" in (c.get("rating") or ""), "Consensus = Buy (IAA)" + f" — {c.get('rating')}"),
        flag((c.get("bull") or 0) >= 70, "Bullish ≥ 70% ของโบรก" + f" — {c.get('bull')}%"),
        flag((c.get("n") or 0) >= 10, "Coverage ≥ 10 โบรก (ความเชื่อมั่นข้อมูล)" + f" — {c.get('n')}"),
    ]
    passed = sum(1 for f in flags if f["ok"])
    return {
        "tk": tk.upper(), "mkt": "TH", "generated": True,
        "asof": datetime.datetime.now().strftime("%Y-%m-%d %H:%M"),
        "cur": "฿", "name": tk.upper(),
        "live": {"target": c.get("tgt"), "rating": c.get("rating"), "n": c.get("n"),
                 "bull": c.get("bull"), "buy": c.get("b"), "hold": c.get("h"), "sell": c.get("s"),
                 "upside": upside},
        "flags": flags, "passed": passed,
        "verdict": ("consensus หนุน" if passed >= 2 else "consensus กลาง ๆ — ดูรายละเอียด"),
        "research": {"label": "Settrade — Analyst Consensus (" + tk.upper() + ")",
                     "url": "https://www.settrade.com/th/equities/quote/" + tk.upper() + "/analyst-consensus"},
        "note": "instant card (consensus ไทยสด) · fundamentals (PE/DE) ดูหน้า Settrade · บทวิเคราะห์เต็มเติมด้วย AI ได้",
    }


def main():
    if len(sys.argv) < 2:
        print("usage: python engine/cfx_stock.py <TICKER> [us|th]"); return
    tk = sys.argv[1].strip().upper()
    mkt = (sys.argv[2].strip().lower() if len(sys.argv) > 2 else "us")
    card = analyze_th(tk) if mkt == "th" else analyze_us(tk)
    if not card:
        print("ไม่พบข้อมูล / ดึงไม่ได้:", tk, mkt); return
    for od in OUT_DIRS:
        os.makedirs(od, exist_ok=True)
        json.dump(card, open(os.path.join(od, tk + ".json"), "w", encoding="utf-8"), ensure_ascii=False, indent=1)
    print("[write]", tk, "→ public/data/stocks + data/stocks · verdict:", card.get("verdict"), "· passed:", card.get("passed"))


if __name__ == "__main__":
    main()
