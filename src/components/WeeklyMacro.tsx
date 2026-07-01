import type { CSSProperties } from 'react';
import { C, F } from '../theme';
import type { LiveFred } from '../hooks/useLiveFred';
import {
  THEME, THEME_DATE, REGIME_BOXES, REGIME_TILT, BB_CURRENT, BB_TRAJECTORY, BB_NOTE,
  MACRO_STATS, PRIVATE_CLIENTS, FLOWS, TRIPWIRES, ANALOG, STANCE,
} from '../data/macro';

const mono9 = (color = C.faint): CSSProperties => ({ fontFamily: F.mono, fontSize: 9, color, letterSpacing: '0.06em' });

const LIVE_STYLE = {
  idle: { bg: 'transparent', color: '#8a8d96', border: 'rgba(255,255,255,0.14)', label: '◌ เชื่อมต่อ FRED สด' },
  connecting: { bg: 'rgba(210,166,74,0.14)', color: '#e0bd6f', border: 'rgba(210,166,74,0.4)', label: '◌ กำลังเชื่อมต่อ…' },
  ok: { bg: 'rgba(78,201,138,0.14)', color: '#4ec98a', border: 'rgba(78,201,138,0.4)', label: '● LIVE' },
  error: { bg: 'rgba(224,89,78,0.12)', color: '#e0594e', border: 'rgba(224,89,78,0.4)', label: '⚠ snapshot' },
};

export default function WeeklyMacro({ fred }: { fred: LiveFred }) {
  const ls = LIVE_STYLE[fred.live];
  const bbPct = Math.min(100, BB_CURRENT * 10);

  return (
    <div id="macro" style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 17, padding: 20, scrollMarginTop: 130 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginBottom: 4 }}>
        <span style={{ fontFamily: F.brand, fontWeight: 700, fontSize: 16, color: C.head }}>Weekly Macro</span>
        <span style={{ fontSize: 11, color: C.faint2 }}>· The Flow Show — Hartnett lens</span>
        <span style={{ marginLeft: 'auto', fontFamily: F.mono, fontSize: 10, color: C.goldLt, background: 'rgba(210,166,74,0.12)', borderRadius: 5, padding: '3px 8px' }}>{THEME_DATE} · {THEME}</span>
      </div>
      <p style={{ margin: '0 0 17px', fontSize: 12, color: C.faint2 }}>periphery เริ่มแตก · เงินเฟ้อแตะ 4% · take-profit bias</p>

      {/* regime 4-box + B&B */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 14 }}>
        <div style={{ border: `1px solid ${C.border}`, borderRadius: 13, padding: 14, background: C.cardInset }}>
          <div style={mono9()}>GROWTH × INFLATION</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 5, marginTop: 9 }}>
            {REGIME_BOXES.map((b) => (
              <div key={b.name} style={{ borderRadius: 8, padding: 7, fontSize: 9, textAlign: 'center', background: b.active ? C.gold : C.chip, color: b.active ? '#1a1306' : C.faint2, fontWeight: b.active ? 700 : 400 }}>{b.name}</div>
            ))}
          </div>
          <div style={{ fontSize: 10.5, color: C.sub, marginTop: 10, lineHeight: 1.4 }}>→ tilt: {REGIME_TILT}</div>
        </div>

        <div style={{ border: `1px solid ${C.border}`, borderRadius: 13, padding: 14, background: C.cardInset }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
            <span style={mono9()}>BULL &amp; BEAR</span>
            <span style={{ fontFamily: F.mono, fontSize: 16, fontWeight: 600, color: C.red }}>{BB_CURRENT.toFixed(1)}</span>
          </div>
          <div style={{ height: 7, borderRadius: 4, marginTop: 11, background: 'linear-gradient(90deg,#4ec98a,#d2a64a,#e0594e)', position: 'relative' }}>
            <span style={{ position: 'absolute', top: -3, left: `${bbPct}%`, height: 13, width: 3, borderRadius: 2, background: C.head, boxShadow: `0 0 0 2px ${C.cardInset}` }} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6, fontFamily: F.mono, fontSize: 8.5, color: C.faint }}>
            <span>2.0 BUY</span><span>8.0 SELL</span>
          </div>
          {/* trajectory ของจริง 4 ฉบับ */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 9 }}>
            {BB_TRAJECTORY.map((p, i) => (
              <div key={p.label} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <span style={{ fontFamily: F.mono, fontSize: 8.5, color: i === BB_TRAJECTORY.length - 1 ? C.red : C.faint }}>{p.v.toFixed(1)}</span>
                {i < BB_TRAJECTORY.length - 1 && <span style={{ color: C.faint3, fontSize: 9 }}>→</span>}
              </div>
            ))}
          </div>
          <div style={{ fontSize: 10, color: C.sub, marginTop: 6, lineHeight: 1.4 }}>{BB_NOTE}</div>
        </div>
      </div>

      {/* macro stats + live connect */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 9 }}>
        <span style={mono9()}>MACRO · FRED snapshot 2026-06-30</span>
        <div style={{ display: 'flex', gap: 6 }}>
          <button onClick={fred.setProxy} title="ตั้งค่า URL ของ proxy" style={{ cursor: 'pointer', fontFamily: F.mono, fontSize: 9.5, padding: '3px 8px', borderRadius: 6, border: '1px solid rgba(255,255,255,0.14)', background: 'transparent', color: C.sub }}>⚙ proxy</button>
          <button onClick={fred.connect} style={{ cursor: 'pointer', fontFamily: F.mono, fontSize: 9.5, padding: '3px 9px', borderRadius: 6, border: `1px solid ${ls.border}`, background: ls.bg, color: ls.color }}>{ls.label}</button>
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 9, marginBottom: 6 }}>
        <Stat label="CPI YoY" value={MACRO_STATS.cpi} color={C.red} />
        <Stat label="10Y UST" value={fred.dgs10} color={C.head} />
        <Stat label="Fed Funds" value={MACRO_STATS.fed} color={C.head} />
        <Stat label="Payrolls" value={MACRO_STATS.payrolls} color={C.green} />
      </div>
      <div style={{ fontFamily: F.mono, fontSize: 9, color: C.faint3, marginBottom: 15, minHeight: 12 }}>{fred.liveMsg}</div>

      {/* private clients + flows */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 15 }}>
        <div>
          <div style={{ ...mono9(), marginBottom: 9 }}>BofA PRIVATE CLIENTS · %AUM</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {PRIVATE_CLIENTS.map((p) => (
              <div key={p.label} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ width: 44, fontSize: 11, color: C.sub }}>{p.label}</span>
                <div style={{ flex: 1, height: 6, background: C.chip, borderRadius: 3 }}>
                  <div style={{ width: `${p.pct}%`, height: '100%', background: p.color, borderRadius: 3 }} />
                </div>
                <span style={{ fontFamily: F.mono, fontSize: 11, color: C.text }}>{p.pct}%</span>
              </div>
            ))}
          </div>
        </div>
        <div>
          <div style={{ ...mono9(), marginBottom: 9 }}>FLOWS · "biggest since"</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 7, fontSize: 11.5 }}>
            {FLOWS.map((f, i) => (
              <div key={i} style={{ display: 'flex', gap: 7 }}>
                <span style={{ color: f.color }}>{f.icon}</span>
                <span style={{ color: '#b6b8c0' }}>{f.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* tripwires (X to $price = event) — operationalize weekly analysis */}
      <div style={{ ...mono9(), marginBottom: 9 }}>TRIPWIRES · "X to $price = event" (สดจาก TradingView)</div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 8, marginBottom: 15 }}>
        {TRIPWIRES.map((t) => (
          <div key={t.label} style={{ display: 'flex', alignItems: 'center', gap: 9, padding: '9px 11px', borderRadius: 10, background: C.cardInset, border: `1px solid ${C.borderSoft}` }}>
            <span style={{ fontFamily: F.mono, fontSize: 11, fontWeight: 600, color: C.head, minWidth: 56 }}>{t.label}</span>
            <span style={{ fontFamily: F.mono, fontSize: 11, color: C.goldLt }}>{t.level}</span>
            <span style={{ fontSize: 10.5, color: C.sub, marginLeft: 'auto', textAlign: 'right', lineHeight: 1.3 }}>{t.meaning}</span>
          </div>
        ))}
      </div>

      {/* analog callout */}
      <div style={{ display: 'flex', gap: 9, alignItems: 'flex-start', background: 'rgba(224,89,78,0.08)', border: '1px solid rgba(224,89,78,0.25)', borderRadius: 11, padding: '11px 13px', marginBottom: 14 }}>
        <span style={{ fontFamily: F.mono, fontSize: 8.5, color: '#1a0a08', background: C.red, padding: '2px 7px', borderRadius: 5, whiteSpace: 'nowrap', marginTop: 1 }}>ANALOG</span>
        <span style={{ fontSize: 11.5, color: '#cfb0ac', lineHeight: 1.45 }}>
          {ANALOG.rule} <b style={{ color: '#f0b8b2' }}>{ANALOG.hi}</b>{ANALOG.rest}
          <br /><span style={{ fontSize: 10.5, color: '#9a8884' }}>⚔️ {ANALOG.caveat}</span>
        </span>
      </div>

      {/* stance */}
      <div style={{ ...mono9(), marginBottom: 9 }}>STANCE · decision logic</div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 9 }}>
        {STANCE.map((s) => (
          <div key={s.phase} style={{ border: `1px solid ${C.border}`, borderRadius: 11, padding: 11, background: C.cardInset }}>
            <div style={{ fontSize: 10, color: '#8a8d96', marginBottom: 4 }}>{s.phase}</div>
            <div style={{ fontSize: 11.5, color: '#dcdee2', lineHeight: 1.4 }}>{s.text}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Stat({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div style={{ textAlign: 'center', padding: '10px 4px', borderRadius: 11, background: C.cardInset }}>
      <div style={{ fontFamily: F.mono, fontSize: 9, color: C.faint }}>{label}</div>
      <div style={{ fontFamily: F.mono, fontSize: 16, fontWeight: 600, color }}>{value}</div>
    </div>
  );
}
