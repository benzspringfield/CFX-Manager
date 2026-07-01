# CFX Engine

ดึงข้อมูล quantitative อัตโนมัติ → เขียน `public/data/live/*.json` ให้ React overlay
**stdlib ล้วน (urllib) — ไม่ต้อง pip install**

## รัน
```bash
python engine/cfx_engine.py
```
เขียน:
- `public/data/live/consensus.json` — consensus (US ดึงสดจาก Finviz · TH/HK คง seed)
- `public/data/live/macro.json` — CPI YoY / 10Y / Fed Funds (FRED)

## แหล่ง (ตามไฟล์กฎที่อนุมัติ)
| แหล่ง | ใช้ทำอะไร | สถานะ |
|---|---|---|
| **Finviz** `finviz.com/quote.ashx?t=` | US: Target Price + Recom (1=Strong Buy..5=Sell) | ✅ auto (requests + UA) |
| **FRED** `fredgraph.csv` | CPI/DGS10/FEDFUNDS (no key) | ✅ auto |
| **Settrade** analyst-consensus | TH: rating/เป้า/ซื้อ-ถือ-ขาย | ⏳ TODO — เป็น SPA ต้องหา JSON API endpoint |
| Yahoo/Morningstar | HK/JP | ❌ บล็อก bot → ต้องใช้ provider ที่มี API key |

## schedule (แนะนำ)
ตั้ง cron / GitHub Action รันทุกเช้า (หลังตลาด US ปิด = เช้าไทย):
```
0 8 * * 1-5  cd /path/to/meridian-advisor && python engine/cfx_engine.py
```

## TODO ต่อ
- Settrade JSON API (ดู network tab ของหน้า analyst-consensus)
- provider HK/JP (มี key) เช่น EOD Historical / Financial Modeling Prep
- ดึงราคา EOD (Stooq) → calibrate entry/stop/target
- เขียน `latest.json` ใหม่ทั้งไฟล์ (รวม live) เป็น snapshot รายวัน `daily/YYYY-MM-DD.json`
