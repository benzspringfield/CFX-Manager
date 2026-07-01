# CFX Manager — Multi-Market Investment Advisor

"โรงงานวิเคราะห์" — เสาความรู้ (JRT + Hartnett + Amorn) เป็นเครื่องจักร · input จากแหล่งที่อนุมัติ · output = บรีฟ + top picks 3 ตลาด
สร้างด้วย **React + Vite + TypeScript** · Charles Francis Xavier (CFX)

## สถาปัตยกรรม (engine ↔ showroom แยกกัน)
```
public/data/daily/2026-07-01.json   ★ source of truth (แปลงจาก data.js — 45 picks + consensus + brief + fullAnalysis)
public/data/daily/latest.json         ที่ React fetch (สำเนา/ล่าสุด)
public/data/live/consensus.json       engine เขียน → React overlay (consensus)
public/data/live/macro.json           engine เขียน → React overlay (มหภาค)

engine/cfx_engine.py                  ★ ดึง Finviz(US)+FRED(มหภาค) อัตโนมัติ → เขียน live/*.json (stdlib ล้วน)

src/
  cfx.ts               types (Daily/Bucket/CfxPick/Consensus)
  useDaily.ts          fetch latest.json + overlay live/*.json
  App.tsx              top bar (นาฬิกาไทย) · brief · 3 tabs × 15 picks · modals
  lib/cfxReport.ts     ★ report builders (stockFull/faBody/consensusBlock) — Amorn+JRT+consensus
  components/          CfxStockModal (เต็มจอ 2 คอลัมน์) · CfxFullModal (ภาวะตลาด)
  theme.ts · lib/tradingview.ts · hooks/useLiveFred.ts (คงไว้)
```
> ไฟล์ `src/data/*`, `src/components/{Market,Weekly,News,Stock,Top,Ticker}*` เดิม = legacy (Meridian) ไม่ถูก import แล้ว

## รัน
```bash
# 1) engine ดึง consensus/มหภาค (ไม่ต้อง pip)
python engine/cfx_engine.py            # เขียน public/data/live/consensus.json + macro.json

# 2) เว็บ
npm install
npm run dev        # http://localhost:5173
npm run build      # typecheck + build → dist/
```
> ยังไม่มี Node บนเครื่องนี้ — ติดตั้ง Node 18+ (nodejs.org) ก่อน `npm ...`

## แหล่งข้อมูล consensus (ตามไฟล์กฎที่อนุมัติ)
| ตลาด | แหล่ง | สถานะ auto |
|---|---|---|
| 🇹🇭 ไทย | **Settrade** analyst-consensus (IAA) per-symbol | ✅ (seed จริง) · engine ต้องใช้ settrade API endpoint (TODO) |
| 🇺🇸 US | **Finviz** (target + recom) | ✅ engine ดึงอัตโนมัติ (ETF ไม่มี consensus) |
| 🇨🇳🇯🇵 HK/JP | Yahoo/Morningstar (บล็อก bot) | 🔗 ลิงก์ per-symbol · engine ต้องใช้ provider API key |

## ฟีเจอร์
- **นาฬิกาไทย** (เดินจริงทุกวินาที) + regime pill
- **บรีฟรายวัน** (Hartnett lens) topics มีแหล่ง+เวลา+fact/opinion + ปุ่มบทวิเคราะห์ฉบับเต็ม (modal)
- **Top picks 15/ตลาด × 3** จัด Tier A/B/C + อันดับ
- **กดหุ้น → เต็มจอ 2 คอลัมน์:** ซ้าย = snapshot (กราฟสด · กลยุทธ์ สั้น/กลาง/ยาว · 🚩 ธงแดง) · ขวา = บทวิเคราะห์เจาะรายตัว (Amorn 4 เลนส์ · เสา JRT อ้างบท · Analyst Consensus · ความเสี่ยง)
- ราคา/consensus จาก engine · qualitative analysis pinned ใน source-of-truth

## แนวทางพัฒนาต่อ
1. **engine TH/HK:** หา Settrade JSON API (network tab) + provider สำหรับ HK/JP (มี key) → consensus ครบทุกตลาดอัตโนมัติ
2. **schedule:** รัน `cfx_engine.py` เป็น cron/GitHub Action ทุกเช้า → live/*.json อัปเดตเอง
3. **prices:** ดึง EOD (Stooq/yfinance) เข้า engine → calibrate entry/stop/target ให้ตรงราคาจริง (เช่น GFPT framework 18 vs consensus 9.84)
4. **JRT numeric:** ต่อ EDGAR/settrade งบจริง → คำนวณ DCF/M-score ตามสูตร KB แทนเชิงคุณภาพ
5. deploy: Cloudflare Pages/Vercel + proxy (FRED)

## หมายเหตุ
decision-support ไม่ใช่คำแนะนำซื้อขาย · ราคา framework = ภาพประกอบจนกว่าจะ calibrate · `preview.html` = prototype แบบเปิด browser ได้เลย (ไม่ต้อง build)
