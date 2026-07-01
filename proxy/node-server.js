// ───────────────────────────────────────────────────────────────
//  MERIDIAN — Data Proxy (Node 18+ ; ใช้ fetch ในตัว)
//  ติดตั้ง:  cd proxy && npm install
//  รัน:      npm start   → http://localhost:8787
//  ในแดชบอร์ด กดปุ่ม ⚙ แล้ววาง http://localhost:8787 → "เชื่อมต่อ"
//
//  Routes เหมือน Cloudflare Worker:
//    GET /fred?id=DGS10&cosd=2026-06-01
//    GET /fred/json?id=CPIAUCSL
//    GET /quote?symbol=spy.us
// ───────────────────────────────────────────────────────────────

const express = require('express');
const app = express();
const PORT = process.env.PORT || 8787;

app.use((req, res, next) => {
  res.set('Access-Control-Allow-Origin', '*');
  res.set('Cache-Control', 'no-store');
  next();
});

async function fredCsv(id, cosd) {
  const url = `https://fred.stlouisfed.org/graph/fredgraph.csv?id=${encodeURIComponent(id)}&cosd=${encodeURIComponent(cosd)}`;
  const r = await fetch(url);
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

app.get('/fred', async (req, res) => {
  try {
    const csv = await fredCsv(req.query.id || 'DGS10', req.query.cosd || '2020-01-01');
    res.type('text/csv').send(csv);
  } catch (e) { res.status(502).send('proxy error: ' + e.message); }
});

app.get('/fred/json', async (req, res) => {
  try {
    const id = req.query.id || 'DGS10';
    const csv = await fredCsv(id, req.query.cosd || '2024-01-01');
    res.json({ id, ...parseFred(csv) });
  } catch (e) { res.status(502).send('proxy error: ' + e.message); }
});

app.get('/quote', async (req, res) => {
  try {
    const s = (req.query.symbol || '').toLowerCase();
    const r = await fetch(`https://stooq.com/q/l/?s=${encodeURIComponent(s)}&f=sd2t2ohlcv&h&e=csv`);
    res.type('text/csv').send(await r.text());
  } catch (e) { res.status(502).send('proxy error: ' + e.message); }
});

app.listen(PORT, () => console.log('MERIDIAN proxy on http://localhost:' + PORT));
