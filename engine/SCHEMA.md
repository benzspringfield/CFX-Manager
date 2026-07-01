# MERIDIAN — Daily Output Schema (engine ↔ showroom contract)

> "โรงงาน" ผลิตไฟล์รายวัน `data/daily/YYYY-MM-DD.json` หนึ่งไฟล์ต่อวัน
> โชว์รูม (เว็บแอป) อ่านไฟล์นี้มาแสดง — **ไม่ hardcode** ข้อมูลในโค้ด
> ทุก field ที่เป็น fact ต้อง trace กลับแหล่งในไฟล์กฎได้ · opinion แยกชั้น · ติด provenance

## โครงสร้าง
```jsonc
{
  "date": "2026-07-01",              // วันที่ผลิต (ISO)
  "tz": "Asia/Bangkok",
  "regime": "Reflation",             // Hartnett 4-box
  "bullBear": 9.1,                   // verified จาก corpus
  "brief": {                          // ข้อ 2 — บรีฟ macro สั้น (Hartnett lens)
    "headline": "…",
    "bullets": ["…","…"],            // 3–5 ข้อ สั้น
    "fullAnalysisUrl": "…",          // ลิงก์ "อ่านฉบับเต็ม" (ประหยัดพื้นที่)
    "sources": [{"name":"…","url":"…","type":"fact|opinion"}]
  },
  "buckets": [                        // ข้อ 3 — 3 ตลาด × 5 ตัว
    {
      "key": "us", "label": "🇺🇸 สหรัฐฯ", "access": "ซื้อตรง US",
      "picks": [ Pick, … (5) ]
    },
    { "key": "cnjp", "label": "🇨🇳🇯🇵 จีน+ญี่ปุ่น", "access": "HKEX ตรง · Japan ผ่าน Thai DR", "picks": [...] },
    { "key": "th", "label": "🇹🇭 ไทย", "access": "SET ตรง", "picks": [...] }
  ],
  "provenance": "verified-first; fact=ไฟล์1, opinion=ไฟล์2"
}
```

## Pick (ข้อ 4 — กดเข้าไปดูเหตุผล/เสา/กลยุทธ์/บทวิเคราะห์)
```jsonc
{
  "tk": "XLE",                       // ticker ที่ใช้ซื้อจริง
  "name": "Energy Select Sector",
  "mkt": "US",
  "tv": "AMEX:XLE",                  // symbol กราฟ TradingView
  "access": "ซื้อตรง US",            // หรือ "Thai DR: <ticker>" / "HKEX"
  "why": "ทำไมน่าสนใจวันนี้ 1–2 ประโยค",
  "pillars": ["Macro/Regime (Hartnett)", "Factor (Ilmanen)"],  // เสาความรู้ที่ใช้
  "strategy": {                       // กลยุทธ์ซื้อ-ขาย (EOD framework)
    "bias": "Buy on dip",
    "entry": "94", "stop": "86", "target": "110", "rr": "1:2.0",
    "note": "เข้าบางส่วน · cut −7~8% · take profit ที่ regime เปลี่ยน"
  },
  "research": {                       // บทวิเคราะห์สถาบัน (ลิงก์แหล่งฟรีที่อนุมัติ)
    "label": "JPM Guide to the Markets",
    "url": "https://am.jpmorgan.com/…"
  },
  "level": "framework"                // framework=EOD ภาพประกอบ · live=ต่อ feed แล้ว
}
```

## กฎการผลิต (engine)
1. **Input เฉพาะแหล่งในไฟล์กฎ 2 ไฟล์** (fact: FRED/EDGAR/Treasury/yfinance/Stooq/SET/Damodaran · opinion: JPM GTM/Apollo/SCB EIC/KResearch/Damodaran blog/SET analyst)
2. **Hybrid:** สกรีน universe (Finviz/yfinance EOD) → Claude ใช้เสาความรู้เขียน why/strategy บน shortlist
3. **Investability gate:** ทุก pick ต้องอยู่ใน `data/universe.json` (ซื้อได้จากไทย)
4. **Provenance:** แยก fact/opinion · ระบุเสาที่ใช้ · `level` บอกว่า EOD-framework หรือ live
5. **decision-support เท่านั้น** ไม่ใช่คำแนะนำซื้อขาย
