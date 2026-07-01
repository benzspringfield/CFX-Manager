import type { CSSProperties } from 'react';
import { C, F } from '../theme';
import { FRAMEWORKS } from '../data/frameworks';
import type { Pick } from '../types';

interface Props {
  activeKey: string;
  onSelectFramework: (key: string) => void;
  onSelectPick: (p: Pick) => void;
}

export default function StockPicks({ activeKey, onSelectFramework, onSelectPick }: Props) {
  const active = FRAMEWORKS.find((d) => d.key === activeKey) || FRAMEWORKS[0];
  const th: CSSProperties = { padding: '8px 11px', fontWeight: 500 };

  return (
    <div id="picks" style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 17, padding: 20, scrollMarginTop: 130 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginBottom: 15, flexWrap: 'wrap' }}>
        <span style={{ fontFamily: F.brand, fontWeight: 700, fontSize: 16, color: C.head }}>Stock Picks</span>
        <span style={{ fontSize: 11, color: C.faint2 }}>· 6 กรอบ — กดที่หุ้นเพื่อดู DCF / กราฟสด / งบ</span>
        <span style={{ marginLeft: 'auto', fontFamily: F.mono, fontSize: 10, color: C.faint3 }}>source · JRT Swing Watchlist 20260630</span>
      </div>

      {/* framework tabs */}
      <div style={{ display: 'flex', gap: 7, flexWrap: 'wrap', marginBottom: 17 }}>
        {FRAMEWORKS.map((d) => {
          const on = d.key === activeKey;
          return (
            <button
              key={d.key}
              onClick={() => onSelectFramework(d.key)}
              style={{ cursor: 'pointer', fontFamily: F.thai, fontSize: 12, fontWeight: 500, padding: '8px 14px', borderRadius: 10, border: `1px solid ${on ? 'rgba(124,108,240,0.55)' : 'rgba(255,255,255,0.12)'}`, background: on ? 'rgba(124,108,240,0.18)' : 'transparent', color: on ? C.purpleText : C.sub }}
            >
              {d.name}
            </button>
          );
        })}
      </div>

      {/* active framework panel */}
      <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start', flexWrap: 'wrap', marginBottom: 15, padding: '15px 17px', background: C.cardInset, borderRadius: 14, border: `1px solid ${C.borderSoft}` }}>
        <div style={{ flex: '1 1 250px' }}>
          <div style={{ fontFamily: F.brand, fontWeight: 700, fontSize: 16, color: C.head }}>{active.name}</div>
          <div style={{ fontSize: 11.5, color: C.goldLt, marginTop: 3 }}>{active.sub}</div>
          <div style={{ fontSize: 12, color: '#b6b8c0', marginTop: 9, lineHeight: 1.55 }}>{active.tilt}</div>
        </div>
        <div style={{ flex: '1 1 330px' }}>
          <div style={{ fontFamily: F.mono, fontSize: 9, color: C.faint, letterSpacing: '0.07em', marginBottom: 8 }}>สมมติฐาน &amp; กรอบเทรด</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {active.assumptions.map((a, i) => (
              <div key={i} style={{ display: 'flex', gap: 8, fontSize: 11.5, color: '#b6b8c0', lineHeight: 1.45 }}>
                <span style={{ color: C.purpleLt }}>·</span><span>{a}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* picks table */}
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12, minWidth: 700 }}>
          <thead>
            <tr style={{ textAlign: 'left', color: C.faint, fontFamily: F.mono, fontSize: 9.5, letterSpacing: '0.05em' }}>
              <th style={th}>หุ้น</th>
              <th style={th}>ตลาด</th>
              <th style={{ ...th, textAlign: 'right' }}>เข้า</th>
              <th style={{ ...th, textAlign: 'right' }}>คัทลอส</th>
              <th style={{ ...th, textAlign: 'right' }}>เป้า</th>
              <th style={{ ...th, textAlign: 'right' }}>R:R</th>
              <th style={th}>สมมติฐาน / โน้ต</th>
              <th style={th}></th>
            </tr>
          </thead>
          <tbody>
            {active.picks.map((p, i) => (
              <tr key={i} onClick={() => onSelectPick(p)} style={{ borderTop: `1px solid ${C.borderSoft}`, cursor: 'pointer' }}>
                <td style={{ padding: 11, fontFamily: F.mono, fontWeight: 600, color: C.head }}>
                  <span style={{ display: 'inline-block', height: 7, width: 7, borderRadius: '50%', background: p.dot, marginRight: 8 }} />{p.tk}
                </td>
                <td style={{ padding: 11 }}>
                  <span style={{ fontFamily: F.mono, fontSize: 10, color: C.sub, background: C.chip, padding: '2px 7px', borderRadius: 5 }}>{p.mkt}</span>
                </td>
                <td style={{ padding: 11, fontFamily: F.mono, color: '#cfd1d6', textAlign: 'right' }}>{p.entry}</td>
                <td style={{ padding: 11, fontFamily: F.mono, color: C.red, textAlign: 'right' }}>{p.stop}</td>
                <td style={{ padding: 11, fontFamily: F.mono, color: C.green, textAlign: 'right' }}>{p.target}</td>
                <td style={{ padding: 11, fontFamily: F.mono, color: C.purpleLt, textAlign: 'right' }}>{p.rr}</td>
                <td style={{ padding: 11, color: '#b6b8c0', lineHeight: 1.4 }}>{p.note}</td>
                <td style={{ padding: 11, textAlign: 'right', color: C.faint, fontSize: 14 }}>›</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div style={{ marginTop: 13, fontSize: 10.5, color: C.faint3, lineHeight: 1.5 }}>
        ระดับราคา (เข้า/คัทลอส/เป้า) เป็นภาพประกอบกรอบการเทรด — กราฟเป็นข้อมูลสดจริงจาก TradingView · macro (FRED) + factor (Ken French) เป็น snapshot จริง 2026-06-30 · decision-support ไม่ใช่คำแนะนำซื้อขาย
      </div>
    </div>
  );
}
