# ติดตั้ง & รัน CFX Manager (Windows)

## 1) ติดตั้ง Node.js (จำเป็นสำหรับเว็บ)
เลือกวิธีใดก็ได้:

**A. Installer (ง่ายสุด)**
1. ไป https://nodejs.org → โหลด **LTS** (เช่น 20.x) → ติดตั้ง (กด Next รวด ๆ)
2. ปิด-เปิด PowerShell ใหม่ แล้วเช็ก:
   ```powershell
   node --version   # ควรได้ v20.x
   npm --version
   ```

**B. winget (ถ้ามี)**
```powershell
winget install OpenJS.NodeJS.LTS
```

**C. nvm-windows (ถ้าต้องสลับหลายเวอร์ชัน)**
- โหลด nvm-setup จาก https://github.com/coreybutler/nvm-windows/releases
```powershell
nvm install 20
nvm use 20
```

## 2) รันเว็บ
```powershell
cd "C:\Users\benzs\OneDrive\Desktop\Stock\โปรแกรมที่ปรึกษาลงทุนหลายตลาด\meridian-advisor"
npm install          # ครั้งแรกครั้งเดียว (โหลด dependencies)
npm run dev          # เปิด http://localhost:5173
```
- แก้โค้ด → เว็บ reload อัตโนมัติ
- `npm run build` = ตรวจ type + build ลง `dist/` (เอาไป deploy ได้)
- `npm run preview` = ดู build

## 3) รัน engine (ดึง consensus/มหภาค — ใช้ Python ที่มีอยู่แล้ว)
```powershell
python engine\cfx_engine.py
```
→ เขียน `public\data\live\consensus.json` (TH+US ดึงสด) + `macro.json`
เว็บจะ overlay ให้อัตโนมัติเมื่อ refresh

> ⚠️ OneDrive: โฟลเดอร์อยู่ใน OneDrive — ถ้า `npm install` ช้า/ติด ให้หยุด sync OneDrive ชั่วคราว หรือย้ายโปรเจกต์ออกจาก OneDrive (เช่น `C:\dev\cfx`)

## 4) (ถ้าต้องการ) proxy FRED สำหรับ live macro ในเว็บ
ดู `proxy/README.md` — deploy Cloudflare Worker แล้วตั้ง `.env`:
```
VITE_PROXY_BASE=https://meridian-proxy.<you>.workers.dev
```

## ลำดับที่แนะนำ
1. ติดตั้ง Node → `npm install` → `npm run dev` (เห็นเว็บ)
2. `python engine\cfx_engine.py` (ข้อมูล consensus สด)
3. ตั้ง GitHub Action ให้รัน engine อัตโนมัติทุกเช้า (ดู `.github/workflows/cfx-engine.yml`)
