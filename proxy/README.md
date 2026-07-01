# MERIDIAN — Data Proxy

แดชบอร์ดรันในเบราว์เซอร์ จึงเรียก **FRED ตรงไม่ได้** (FRED ไม่ตั้งค่า CORS) proxy เล็กๆ นี้ทำหน้าที่ตัวกลาง: เบราว์เซอร์ → proxy (มี CORS) → FRED/ราคา แล้วส่งกลับ

มีให้ 2 แบบ เลือกอันใดอันหนึ่ง:

## ตัวเลือก A — Cloudflare Worker (ฟรี, แนะนำ, ไม่ต้องมีเซิร์ฟเวอร์)
```bash
npm i -g wrangler
wrangler login
cd proxy
wrangler deploy
```
จะได้ URL เช่น `https://meridian-proxy.<you>.workers.dev`

## ตัวเลือก B — Node (รันบนเครื่อง/เซิร์ฟเวอร์ของคุณ)
```bash
cd proxy
npm install
npm start                    # → http://localhost:8787
```

## เชื่อมเข้าแดชบอร์ด (2 ทาง)
1. **ผ่าน env (ถาวร):** ในรากโปรเจกต์สร้างไฟล์ `.env` ใส่ `VITE_PROXY_BASE=https://meridian-proxy.<you>.workers.dev` แล้ว `npm run build`
2. **ผ่าน UI (ชั่วคราว):** ในการ์ด **Weekly Macro** กดปุ่ม **⚙ proxy** → วาง URL → กด **เชื่อมต่อ FRED สด** (เก็บใน localStorage)

## Endpoints
| route | ทำอะไร | ตัวอย่าง |
|---|---|---|
| `/fred?id=DGS10&cosd=2026-06-01` | FRED CSV ดิบ + CORS | 10Y Treasury |
| `/fred/json?id=CPIAUCSL` | สรุปเป็น JSON `{latest,date,prev}` | CPI |
| `/quote?symbol=spy.us` | ราคา OHLCV จาก Stooq | ดัชนี/หุ้น |

FRED series ที่ใช้บ่อย (ตรงกับ data layer ของ JRT): `PAYEMS` `UNRATE` `CPIAUCSL` `PPIACO` `DGS10` `FEDFUNDS` `T10Y2Y` `M2SL` `INDPRO` `UMCSENT`
+ สำหรับ tripwire/credit: `DGS30` (30Y) `BAMLH0A0HYM2` (HY OAS) `BAMLC0A0CM` (IG OAS)

## หมายเหตุ
- เพื่อความเสถียร production ใส่ FRED API key ฟรี (https://fredaccount.stlouisfed.org/apikeys) ใน worker/server
- ราคาหุ้นรายตลาด (TH/JP/CN) แนะนำต่อ provider ที่มีสิทธิ์ (settrade, EOD Historical) — Stooq ใช้ได้ระดับ EOD สำหรับ prototype
- กราฟในแดชบอร์ดเป็น **TradingView สดอยู่แล้ว** ไม่ต้องผ่าน proxy
