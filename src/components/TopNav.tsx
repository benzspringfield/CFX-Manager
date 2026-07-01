import type { CSSProperties } from 'react';
import { C, F } from '../theme';
import TickerTape from './TickerTape';

export default function TopNav({ onOpenReport }: { onOpenReport: () => void }) {
  const link: CSSProperties = { fontSize: 12.5, color: C.sub, padding: '7px 12px', borderRadius: 8 };
  return (
    <div
      className="no-print"
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 20,
        background: 'rgba(11,13,18,0.82)',
        backdropFilter: 'blur(14px)',
        borderBottom: `1px solid ${C.border}`,
      }}
    >
      <div style={{ maxWidth: 1360, margin: '0 auto', display: 'flex', alignItems: 'center', gap: 16, padding: '13px 26px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ height: 32, width: 32, borderRadius: 10, background: 'linear-gradient(135deg,#7c6cf0,#a98cff)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontFamily: F.brand, fontWeight: 800, fontSize: 16 }}>M</div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontFamily: F.brand, fontWeight: 800, fontSize: 15, letterSpacing: '0.13em', color: C.head }}>MERIDIAN</span>
            <span style={{ fontSize: 10, color: C.faint2 }}>multi-market investment advisor</span>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 4, marginLeft: 18 }}>
          <a href="#macro" style={link}>Macro</a>
          <a href="#news" style={link}>News</a>
          <a href="#picks" style={link}>Picks</a>
        </div>
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 10 }}>
          <button onClick={onOpenReport} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 7, background: 'rgba(124,108,240,0.16)', border: '1px solid rgba(124,108,240,0.45)', borderRadius: 10, padding: '8px 14px', color: C.purpleText, fontFamily: F.thai, fontSize: 12.5, fontWeight: 600 }}>
            <span>▤</span> รายงานสัปดาห์
          </button>
          <div style={{ display: 'flex', alignItems: 'center', gap: 7, background: 'rgba(210,166,74,0.12)', border: '1px solid rgba(210,166,74,0.35)', borderRadius: 20, padding: '6px 13px' }}>
            <span style={{ height: 7, width: 7, borderRadius: '50%', background: C.gold }} />
            <span style={{ fontFamily: F.brand, fontWeight: 700, fontSize: 12, color: C.goldLt, letterSpacing: '0.04em' }}>REFLATION</span>
          </div>
        </div>
      </div>
      <TickerTape />
    </div>
  );
}
