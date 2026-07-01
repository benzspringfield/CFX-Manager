import { useState } from 'react';
import { C, F } from '../theme';

// แท็บวิเคราะห์หุ้นรายตัว — โหลดการ์ดที่ engine (cfx_stock.py) เขียนไว้ที่ data/stocks/<TK>.json
type Flag = { ok: boolean; text: string };
type Card = {
  tk: string; mkt: string; cur?: string; name?: string; asof?: string;
  live?: Record<string, number | string | null>;
  flags?: Flag[]; passed?: number; verdict?: string;
  research?: { label?: string; url?: string }; note?: string;
};

const mnum = (v: unknown, suf = '') => (v === null || v === undefined || v === '') ? '—' : `${v}${suf}`;

export default function CfxStockScope() {
  const base = import.meta.env.BASE_URL || '/';
  const [tk, setTk] = useState('');
  const [mkt, setMkt] = useState('us');
  const [card, setCard] = useState<Card | null>(null);
  const [status, setStatus] = useState<'' | 'loading' | 'missing'>('');

  const run = () => {
    const t = tk.trim().toUpperCase();
    if (!t) return;
    setCard(null); setStatus('loading');
    fetch(`${base}data/stocks/${t}.json?v=${Date.now()}`)
      .then((r) => { if (!r.ok) throw new Error('404'); return r.json(); })
      .then((c: Card) => { setCard(c); setStatus(''); })
      .catch(() => { setStatus('missing'); });
  };

  const cmd = (deep = false) => `วิเคราะห์หุ้น ${tk.trim().toUpperCase()} (${mkt.toUpperCase()})${deep ? ' แบบเต็ม' : ''}`;
  const copy = (s: string) => { try { navigator.clipboard?.writeText(s); } catch { /* noop */ } };

  const cell = (l: string, v: string) => (
    <div style={{ background: C.cardInset, borderRadius: 9, padding: '9px 6px', textAlign: 'center' }}>
      <div style={{ fontFamily: F.mono, fontSize: 8.5, color: C.faint }}>{l}</div>
      <div style={{ fontFamily: F.mono, fontSize: 13, color: C.head2, marginTop: 2 }}>{v}</div>
    </div>
  );

  const L = card?.live || {};
  const cur = card?.cur || '';
  const rating = String(L.rating || '');
  const rc = /Buy/i.test(rating) ? C.green : /Hold/i.test(rating) ? C.gold : /Sell/i.test(rating) ? C.red : C.sub;
  const vColor = (card?.passed || 0) >= 4 ? C.green : (card?.passed || 0) >= 2 ? C.gold : C.red;

  return (
    <div className="card" style={{ marginBottom: 18 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginBottom: 4, flexWrap: 'wrap' }}>
        <span style={{ fontFamily: F.brand, fontWeight: 700, fontSize: 16, color: C.head }}>🔍 วิเคราะห์หุ้นรายตัว</span>
        <span style={{ fontSize: 11, color: C.faint2 }}>· พิมพ์ ticker → การ์ดสด (Amorn/JRT) · เต็มเชิงคุณภาพเติมด้วย AI</span>
      </div>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center', margin: '12px 0 6px' }}>
        <input value={tk} onChange={(e) => setTk(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') run(); }}
          placeholder="เช่น NVDA, AAPL, PTT, KBANK"
          style={{ flex: 1, minWidth: 180, background: '#0d1016', border: `1px solid ${C.border}`, borderRadius: 10, padding: '10px 14px', color: C.head2, fontSize: 13, outline: 'none' }} />
        <select value={mkt} onChange={(e) => setMkt(e.target.value)}
          style={{ background: '#0d1016', border: `1px solid ${C.border}`, borderRadius: 10, padding: '10px 12px', color: C.head2, fontSize: 13 }}>
          <option value="us">US</option><option value="th">TH</option>
        </select>
        <button onClick={run} style={{ cursor: 'pointer', background: 'rgba(124,108,240,.2)', border: '1px solid rgba(124,108,240,.5)', borderRadius: 10, padding: '10px 20px', color: C.purpleText, fontSize: 13, fontWeight: 600 }}>วิเคราะห์</button>
      </div>

      {status === 'loading' && <div style={{ fontFamily: F.mono, fontSize: 11, color: C.sub, padding: 10 }}>กำลังโหลด {tk.toUpperCase()}…</div>}

      {status === 'missing' && (
        <div style={{ background: '#161a22', border: '1px solid rgba(210,166,74,.3)', borderRadius: 12, padding: '16px 18px', marginTop: 10 }}>
          <div style={{ fontSize: 12.5, color: '#e8c98a', marginBottom: 10 }}>ยังไม่มีการ์ดของ <b>{tk.toUpperCase()}</b> — สร้างได้ 2 วิธี:</div>
          <div style={{ fontSize: 11.5, color: '#cfd1d6', lineHeight: 1.7 }}>
            ① <b>Instant (ข้อมูล+กฎ):</b> รันในเครื่อง <code style={{ background: '#0d1016', padding: '2px 7px', borderRadius: 5, color: '#a3d8c0' }}>python engine/cfx_stock.py {tk.toUpperCase()} {mkt}</code><br />
            ② <b>บทวิเคราะห์เต็ม (AI):</b> พิมพ์ใน Claude → <code style={{ background: '#0d1016', padding: '2px 7px', borderRadius: 5, color: C.purpleText }}>{cmd(true)}</code>
          </div>
          <button onClick={() => copy(cmd(true))} style={{ marginTop: 12, cursor: 'pointer', background: 'rgba(124,108,240,.16)', border: '1px solid rgba(124,108,240,.4)', borderRadius: 8, padding: '7px 14px', color: C.purpleText, fontSize: 11.5 }}>📋 คัดลอกคำสั่ง AI</button>
        </div>
      )}

      {card && (
        <div style={{ background: '#13161d', border: `1px solid ${C.border}`, borderRadius: 14, overflow: 'hidden', marginTop: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 11, padding: '14px 18px', background: 'linear-gradient(135deg,rgba(124,108,240,.14),rgba(210,166,74,.06))', borderBottom: `1px solid ${C.border}`, flexWrap: 'wrap' }}>
            <span style={{ fontFamily: F.brand, fontSize: 19, fontWeight: 800, color: C.head2 }}>{card.tk}</span>
            <span style={{ fontSize: 11, color: C.sub }}>{card.mkt}</span>
            {rating && <span style={{ fontSize: 12, fontWeight: 700, color: rc }}>{rating}</span>}
            <span style={{ marginLeft: 'auto', fontFamily: F.mono, fontSize: 11, color: vColor, fontWeight: 600 }}>{card.verdict} ({card.passed} เกณฑ์)</span>
          </div>
          <div style={{ padding: '16px 18px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 8, marginBottom: 14 }}>
              {card.mkt === 'US' ? (<>
                {cell('ราคา', cur + mnum(L.price))}{cell('P/E', mnum(L.pe))}{cell('PEG', mnum(L.peg))}{cell('D/E', mnum(L.de))}
                {cell('ROE', mnum(L.roe, '%'))}{cell('เป้า', cur + mnum(L.target))}{cell('Upside', mnum(L.upside, '%'))}{cell('YTD', mnum(L.perfYtd, '%'))}
              </>) : (<>
                {cell('Rating', mnum(L.rating))}{cell('เป้า', cur + mnum(L.target))}{cell('โบรก', mnum(L.n))}{cell('Bullish', mnum(L.bull, '%'))}
                {cell('ซื้อ', mnum(L.buy))}{cell('ถือ', mnum(L.hold))}{cell('ขาย', mnum(L.sell))}{cell('', '')}
              </>)}
            </div>
            <div style={{ fontFamily: F.mono, fontSize: 9, color: C.faint, marginBottom: 6 }}>เกณฑ์ VI / Amorn (อัตโนมัติ · as of {card.asof})</div>
            {(card.flags || []).map((f, i) => (
              <div key={i} style={{ display: 'flex', gap: 8, alignItems: 'flex-start', padding: '6px 0', fontSize: 12, color: f.ok ? '#cfd1d6' : '#9a8884' }}>
                <span>{f.ok ? '✅' : '⛔'}</span><span>{f.text}</span>
              </div>
            ))}
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginTop: 14, alignItems: 'center' }}>
              <a href={card.research?.url || '#'} target="_blank" rel="noreferrer" style={{ background: C.cardInset, border: '1px solid rgba(255,255,255,.12)', borderRadius: 9, padding: '8px 13px', color: '#cfd1d6', fontSize: 11.5 }}>📄 {card.research?.label || 'แหล่ง'} →</a>
              <button onClick={() => copy(cmd(true))} style={{ cursor: 'pointer', background: 'rgba(124,108,240,.16)', border: '1px solid rgba(124,108,240,.4)', borderRadius: 9, padding: '8px 13px', color: C.purpleText, fontSize: 11.5 }}>🤖 ขอบทวิเคราะห์เต็มจาก AI (คัดลอกคำสั่ง)</button>
            </div>
            <div style={{ fontFamily: F.mono, fontSize: 9, color: C.faint3, marginTop: 10, lineHeight: 1.5 }}>{card.note} · decision-support ไม่ใช่คำแนะนำซื้อขาย</div>
          </div>
        </div>
      )}
    </div>
  );
}
