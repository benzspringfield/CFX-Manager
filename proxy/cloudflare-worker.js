// ───────────────────────────────────────────────────────────────
//  MERIDIAN — Data Proxy (Cloudflare Worker)
//  ทำหน้าที่เป็นตัวกลาง: เบราว์เซอร์เรียก proxy นี้ (มี CORS) แล้ว proxy
//  ไปดึง FRED / ราคาหุ้นให้ — แก้ปัญหา FRED เรียกตรงจากเบราว์เซอร์ไม่ได้
//
//  Deploy (ฟรี):
//    1) npm i -g wrangler ; wrangler login
//    2) wrangler deploy   (ในโฟลเดอร์นี้ ใช้ wrangler.toml ที่ให้ไว้)
//    3) ได้ URL เช่น https://meridian-proxy.<you>.workers.dev
//    4) ตั้ง env VITE_PROXY_BASE=<URL> หรือกดปุ่ม ⚙ ในแดชบอร์ดแล้ววาง URL
//
//  Routes:
//    GET /fred?id=DGS10&cosd=2026-06-01   → FRED CSV (พร้อม CORS)
//    GET /fred/json?id=CPIAUCSL           → { id, latest, date, prev } (สรุปให้)
//    GET /quote?symbol=spy.us             → ราคา CSV จาก Stooq (พร้อม CORS)
// ───────────────────────────────────────────────────────────────

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET,OPTIONS',
  'Access-Control-Allow-Headers': '*',
  'Cache-Control': 'no-store',
};

const FRED_KEY = ''; // (ไม่บังคับ) ใส่ API key ฟรีจาก https://fredaccount.stlouisfed.org/apikeys เพื่อความเสถียร

async function fredCsv(id, cosd) {
  const url = `https://fred.stlouisfed.org/graph/fredgraph.csv?id=${encodeURIComponent(id)}&cosd=${encodeURIComponent(cosd)}`;
  const r = await fetch(url, { cf: { cacheTtl: 300 } });
  if (!r.ok) throw new Error('FRED ' + r.status);
  return await r.text();
}

function parseFred(csv) {
  const rows = csv.trim().split('\n').slice(1)
    .map((l) => l.split(','))
    .filter((c) => c[1] && c[1] !== '.');
  const last = rows[rows.length - 1] || [];
  const prev = rows[rows.length - 2] || [];
  return { date: last[0], latest: parseFloat(last[1]), prev: parseFloat(prev[1]) };
}

export default {
  async fetch(req) {
    const u = new URL(req.url);
    if (req.method === 'OPTIONS') return new Response(null, { headers: CORS });

    try {
      if (u.pathname === '/fred') {
        const id = u.searchParams.get('id') || 'DGS10';
        const cosd = u.searchParams.get('cosd') || '2020-01-01';
        const csv = await fredCsv(id, cosd);
        return new Response(csv, { headers: { ...CORS, 'content-type': 'text/csv' } });
      }

      if (u.pathname === '/fred/json') {
        const id = u.searchParams.get('id') || 'DGS10';
        const cosd = u.searchParams.get('cosd') || '2024-01-01';
        const csv = await fredCsv(id, cosd);
        const p = parseFred(csv);
        return new Response(JSON.stringify({ id, ...p }), { headers: { ...CORS, 'content-type': 'application/json' } });
      }

      if (u.pathname === '/quote') {
        const s = (u.searchParams.get('symbol') || '').toLowerCase();
        const r = await fetch(`https://stooq.com/q/l/?s=${encodeURIComponent(s)}&f=sd2t2ohlcv&h&e=csv`);
        const t = await r.text();
        return new Response(t, { headers: { ...CORS, 'content-type': 'text/csv' } });
      }

      return new Response('MERIDIAN proxy ✓  ลอง /fred?id=DGS10  ·  /fred/json?id=CPIAUCSL  ·  /quote?symbol=spy.us', { headers: CORS });
    } catch (e) {
      return new Response('proxy error: ' + e.message, { status: 502, headers: CORS });
    }
  },
};
