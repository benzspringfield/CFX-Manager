#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
build_preview.py — รวม source-of-truth + live facts → artifacts ที่ UI อ่าน
  อ่าน : public/data/daily/2026-07-01.json  (source of truth, authored)
         public/data/live/{consensus,macro,market}.json  (engine เขียน)
  เขียน: public/data/daily/latest.json      (React fetch)
         data/daily/2026-07-01.js           (preview.html <script src>)

รันหลัง cfx_engine.py เสมอ:  python engine/build_preview.py
Inject live เข้า field ที่ renderer เดิมรองรับอยู่แล้ว (sections/regime.box/bullBear/tripwires)
จึงไม่ต้องแก้ faBodyHTML — โชว์ทั้ง React และ preview ทันที
"""
import json, os
from datetime import date

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = os.path.join(ROOT, "public", "data", "daily", "2026-07-01.json")
LIVE = os.path.join(ROOT, "public", "data", "live")
OUT_JSON = os.path.join(ROOT, "public", "data", "daily", "latest.json")
OUT_JS = os.path.join(ROOT, "data", "daily", "2026-07-01.js")


def load(p):
    return json.load(open(p, encoding="utf-8")) if os.path.exists(p) else None


SCORE_LABEL = {"oil": "น้ำมัน", "commodities": "สินค้าโภคภัณฑ์", "SPX": "S&P 500", "gold": "ทอง",
               "US$": "ดอลลาร์", "HY": "หุ้นกู้ HY", "IG": "หุ้นกู้ IG", "govt": "พันธบัตร",
               "EM": "ตลาดเกิดใหม่", "bitcoin": "บิตคอยน์"}


def scores_html(scores, asof):
    if not scores:
        return ""
    chips = []
    for k, v in scores.items():
        col = "#4ec98a" if v > 0 else "#e0594e" if v < 0 else "#9a9da6"
        sign = "+" if v > 0 else ""
        chips.append(
            '<span style="display:inline-flex;gap:6px;align-items:baseline;background:#14171e;'
            'border:1px solid rgba(255,255,255,.07);border-radius:8px;padding:5px 10px;margin:0 6px 6px 0;">'
            '<span style="font-size:10.5px;color:#9a9da6;">' + SCORE_LABEL.get(k, k) + '</span>'
            '<span class="mono" style="font-size:12px;color:' + col + ';font-weight:600;">'
            + sign + str(round(v, 1)) + '%</span></span>')
    return (
        '<div style="font-size:11px;color:#9a9da6;line-height:1.6;margin-bottom:10px;">'
        'ผลตอบแทนตั้งแต่ต้นปี (YTD) ต่อกลุ่มสินทรัพย์ — <b style="color:#cbb890;">ดึงสด</b>วันนี้ '
        '(อัปเดต ' + asof + '), แยกจาก<b>บทวิเคราะห์ Hartnett รายสัปดาห์</b>ด้านล่าง:</div>'
        '<div style="display:flex;flex-wrap:wrap;">' + "".join(chips) + '</div>')


def tripwire_note(scores_asof, market):
    # แถบสรุป tripwire สด (label · ค่า · สถานะ)
    tw = market.get("tripwires") or []
    rows = []
    for t in tw:
        val = t.get("value")
        if val is None:
            state, col = "n/a (ต้องใช้ FRED/Actions)", "#6b6e78"
        elif t.get("triggered"):
            state, col = "⚠︎ ถึงเกณฑ์แล้ว", "#e0594e"
        else:
            state, col = "✓ ยังปลอดภัย", "#4ec98a"
        approx = " ~" if t.get("approx") else ""
        rows.append(
            '<div style="display:flex;gap:9px;align-items:center;background:#14171e;border-radius:8px;'
            'padding:7px 11px;margin-bottom:5px;"><span class="mono" style="font-size:11px;color:#f0f1f4;'
            'font-weight:600;min-width:72px;">' + t.get("label", "") + '</span>'
            '<span class="mono" style="font-size:11px;color:#cbb890;">'
            + (str(val) + approx if val is not None else "—") + ' · เกณฑ์ ' + t.get("level", "") + '</span>'
            '<span class="mono" style="font-size:10.5px;color:' + col + ';margin-left:auto;">' + state + '</span></div>')
    return '<div style="margin-top:6px;">' + "".join(rows) + '</div>' if rows else ""


def th_consensus_html(d, asof):
    cons = d.get("consensus") or {}
    th = {k: v for k, v in cons.items() if v.get("src") == "st"}
    if not th:
        return '<div style="font-size:11px;color:#9a9da6;">ยังไม่มี consensus ไทยสด (รัน engine)</div>'
    buy = sum(1 for v in th.values() if "Buy" in (v.get("rating") or ""))
    hold = sum(1 for v in th.values() if "Hold" in (v.get("rating") or ""))
    # เรียงตาม bullish% เอา 4 ตัวเด่น
    top = sorted(th.items(), key=lambda kv: kv[1].get("bull") or 0, reverse=True)[:4]
    chips = "".join(
        '<span style="display:inline-flex;gap:6px;align-items:baseline;background:#14171e;'
        'border:1px solid rgba(255,255,255,.07);border-radius:8px;padding:5px 10px;margin:0 6px 6px 0;">'
        '<span style="font-size:11px;color:#f0f1f4;font-weight:600;">' + k + '</span>'
        '<span class="mono" style="font-size:10.5px;color:' + ('#4ec98a' if 'Buy' in (v.get('rating') or '') else '#d2a64a') + ';">'
        + (v.get("rating") or "n/a") + ' ฿' + str(v.get("tgt") or "-") + '</span></span>'
        for k, v in top)
    return ('<div style="font-size:11px;color:#9a9da6;line-height:1.6;margin-bottom:10px;">'
            'Consensus นักวิเคราะห์ไทย (Settrade/IAA) — <b style="color:#cbb890;">ดึงสด</b> ' + asof
            + ': จาก ' + str(len(th)) + ' ตัว <b style="color:#4ec98a;">Buy ' + str(buy) + '</b> · Hold ' + str(hold)
            + ' — เป้าราคาเฉลี่ยต่อตัวดูได้ในหุ้นรายตัว</div>'
            '<div style="display:flex;flex-wrap:wrap;">' + chips + '</div>')


def inject_live(d, market):
    if not market:
        return d
    asof = market.get("asof", str(date.today()))
    reg = market.get("regime") or {}
    bb = market.get("bullBear") or {}
    # top-level
    if reg.get("name"):
        d["regime"] = reg["name"]
    if bb.get("value") is not None:
        d["bullBear"] = bb["value"]
    d["liveAsof"] = asof
    d["market"] = market

    # live section แยกตามประเทศ (ข้อ 2/4): scores โลก + tripwire → US เท่านั้น
    # CN+JP = เจาะ EM/จีน · TH = สรุป consensus ไทยสด
    sc = market.get("scores") or {}
    def one_chip(label, key):
        v = sc.get(key)
        if v is None:
            return ""
        col = "#4ec98a" if v > 0 else "#e0594e"
        sign = "+" if v > 0 else ""
        return ('<span style="display:inline-flex;gap:6px;align-items:baseline;background:#14171e;'
                'border:1px solid rgba(255,255,255,.07);border-radius:8px;padding:5px 10px;margin:0 6px 6px 0;">'
                '<span style="font-size:10.5px;color:#9a9da6;">' + label + '</span>'
                '<span class="mono" style="font-size:12px;color:' + col + ';font-weight:600;">'
                + sign + str(round(v, 1)) + '%</span></span>')

    live_sections = {
        "us": {
            "h": "📊 ข้อมูลตลาดวันนี้ (ดึงสด · as of " + asof + ")",
            "body": scores_html(sc, asof) + tripwire_note(asof, market),
        },
        "cnjp": {
            "h": "📊 EM / จีน วันนี้ (ดึงสด · as of " + asof + ")",
            "body": ('<div style="font-size:11px;color:#9a9da6;line-height:1.6;margin-bottom:10px;">'
                     'ผลตอบแทน YTD ที่เกี่ยวกับธีมจีน+ญี่ปุ่น — <b style="color:#cbb890;">ดึงสด</b> (แยกจากมุมมอง Hartnett ด้านล่าง):</div>'
                     '<div style="display:flex;flex-wrap:wrap;">' + one_chip("ตลาดเกิดใหม่ (EM)", "EM")
                     + one_chip("S&P 500 (เทียบ)", "SPX") + one_chip("ทอง", "gold") + '</div>'),
        },
        "th": {
            "h": "📊 หุ้นไทยวันนี้ (Consensus สด · as of " + asof + ")",
            "body": th_consensus_html(d, asof),
        },
    }

    for key, brief in (d.get("briefs") or {}).items():
        f = brief.get("full")
        if not f:
            continue
        live_section = live_sections.get(key, live_sections["us"])
        # regime box + bull&bear (สด) — เฉพาะ tab ที่มีโครง (us)
        if reg.get("box") and f.get("regime"):
            f["regime"]["box"] = reg["box"]
        if bb.get("value") is not None and f.get("bullBear"):
            traj = list(f["bullBear"].get("trajectory") or [])
            traj = (traj[-2:] if len(traj) >= 2 else traj) + [[asof[5:10], bb["value"]]]
            f["bullBear"]["trajectory"] = traj
            f["bullBear"]["value"] = bb["value"]
            f["bullBear"]["note"] = bb.get("note", f["bullBear"].get("note", ""))
        # tripwires สด (merge by label)
        if market.get("tripwires") and f.get("tripwires"):
            mtw = {t["label"]: t for t in market["tripwires"]}
            for t in f["tripwires"]:
                m = mtw.get(t.get("label"))
                if not m:
                    continue
                v = m.get("value")
                if v is None:
                    t["level"] = m.get("level", t.get("level"))
                elif m.get("triggered"):
                    t["level"] = str(v) + " · เกณฑ์ " + m.get("level", "") + " · ⚠︎ ถึงแล้ว"
                else:
                    t["level"] = str(v) + " · เกณฑ์ " + m.get("level", "") + " · ✓ ปลอดภัย"
        # prepend live section ให้ทุก tab (scores เป็น global)
        f["sections"] = [live_section] + list(f.get("sections") or [])
    return d


def main():
    d = load(SRC)
    cons = load(os.path.join(LIVE, "consensus.json"))
    macro = load(os.path.join(LIVE, "macro.json"))
    market = load(os.path.join(LIVE, "market.json"))
    if cons:
        d["consensus"] = {**(d.get("consensus") or {}), **cons}
    if macro:
        d["macro"] = macro
    d = inject_live(d, market)

    json.dump(d, open(OUT_JSON, "w", encoding="utf-8"), ensure_ascii=False, indent=1)
    print("[write]", os.path.relpath(OUT_JSON, ROOT))

    os.makedirs(os.path.dirname(OUT_JS), exist_ok=True)
    with open(OUT_JS, "w", encoding="utf-8") as fh:
        fh.write("/* CFX daily — regenerated (source + live). โหลดผ่าน <script src> */\n")
        fh.write("window.CFX_DAILY = " + json.dumps(d, ensure_ascii=False) + ";\n")
    print("[write]", os.path.relpath(OUT_JS, ROOT))
    print("done. regime=%s bullBear=%s liveAsof=%s" % (d.get("regime"), d.get("bullBear"), d.get("liveAsof")))


if __name__ == "__main__":
    main()
