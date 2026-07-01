import { useEffect, useRef } from 'react';
import type { ReactElement } from 'react';
import { C, F } from '../theme';
import type { Pick } from '../types';
import { injectWidget, TV_ADV, drawerConfig } from '../lib/tradingview';

interface Props {
  sel: Pick;
  frameworkName: string;
  onClose: () => void;
}

const kv = (label: string, value: string, color = '#cfd1d6'): ReactElement => (
  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '9px 12px', borderRadius: 9, background: C.cardInset }}>
    <span style={{ fontSize: 11, color: '#8a8d96' }}>{label}</span>
    <span style={{ fontFamily: F.mono, fontSize: 12, color }}>{value}</span>
  </div>
);

const cell = (label: string, value: string, color: string): ReactElement => (
  <div style={{ textAlign: 'center', padding: '11px 4px', borderRadius: 11, background: C.cardInset }}>
    <div style={{ fontFamily: F.mono, fontSize: 9, color: C.faint }}>{label}</div>
    <div style={{ fontFamily: F.mono, fontSize: 14, color, marginTop: 3 }}>{value}</div>
  </div>
);

export default function StockDrawer({ sel, frameworkName, onClose }: Props) {
  const chartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const t = setTimeout(() => {
      if (!sel.tv) {
        if (chartRef.current) chartRef.current.innerHTML = '<div style="display:flex;height:100%;align-items:center;justify-content:center;color:#54565e;font-size:12px;">ไม่มีสัญลักษณ์สำหรับหุ้นนี้</div>';
        return;
      }
      injectWidget(chartRef.current, TV_ADV, drawerConfig(sel.tv));
    }, 120);
    return () => clearTimeout(t);
  }, [sel.tv]);

  return (
    <div className="no-print" onClick={onClose} style={{ position: 'fixed', inset: 0, zIndex: 40, background: 'rgba(6,7,11,0.6)', backdropFilter: 'blur(3px)', display: 'flex', justifyContent: 'flex-end' }}>
      <div onClick={(e) => e.stopPropagation()} style={{ width: 580, maxWidth: '94vw', height: '100%', overflowY: 'auto', background: C.drawer, borderLeft: '1px solid rgba(255,255,255,0.09)', animation: 'ddin 0.25s ease', padding: '22px 24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 4 }}>
          <span style={{ fontFamily: F.mono, fontWeight: 600, fontSize: 20, color: C.head2 }}>{sel.tk}</span>
          <span style={{ fontFamily: F.mono, fontSize: 10, color: C.sub, background: C.chip, padding: '2px 8px', borderRadius: 6 }}>{sel.mkt}</span>
          <span style={{ fontFamily: F.mono, fontSize: 10, color: C.purpleText, background: 'rgba(124,108,240,0.15)', padding: '2px 8px', borderRadius: 6 }}>{frameworkName}</span>
          <button onClick={onClose} style={{ marginLeft: 'auto', cursor: 'pointer', background: C.cardInset, border: '1px solid rgba(255,255,255,0.1)', color: '#cfd1d6', height: 30, width: 30, borderRadius: 8, fontSize: 15 }}>✕</button>
        </div>
        <div style={{ fontSize: 12, color: '#8a8d96', marginBottom: 14 }}>{sel.note}</div>

        <div ref={chartRef} style={{ height: 280, border: `1px solid ${C.border}`, borderRadius: 13, overflow: 'hidden', background: '#0d1016', marginBottom: 8 }} />
        <div style={{ fontFamily: F.mono, fontSize: 9, color: C.faint3, marginBottom: 16 }}>{sel.tv || '—'} · live · TradingView</div>

        <div style={{ fontFamily: F.mono, fontSize: 9, color: C.faint, letterSpacing: '0.07em', marginBottom: 8 }}>กรอบการเทรด</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 8, marginBottom: 18 }}>
          {cell('เข้า', sel.entry, C.text)}
          {cell('คัทลอส', sel.stop, C.red)}
          {cell('เป้า', sel.target, C.green)}
          {cell('R:R', sel.rr, C.purpleLt)}
        </div>

        <div style={{ fontFamily: F.mono, fontSize: 9, color: C.faint, letterSpacing: '0.07em', marginBottom: 8 }}>VALUATION · DCF</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 18 }}>
          {kv('Fair value', sel.dd.fv, C.head)}
          {kv('Upside', sel.dd.up, C.green)}
          {kv('WACC', sel.dd.wacc)}
          {kv('Terminal g', sel.dd.g)}
        </div>

        <div style={{ fontFamily: F.mono, fontSize: 9, color: C.faint, letterSpacing: '0.07em', marginBottom: 8 }}>FINANCIAL SNAPSHOT</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 8 }}>
          {kv('Revenue growth', sel.dd.rev)}
          {kv('Op. margin', sel.dd.mgn)}
          {kv('ROIC', sel.dd.roic)}
          {kv('P/E', sel.dd.pe)}
        </div>
        <div style={{ marginTop: 16, fontSize: 10, color: C.faint3, lineHeight: 1.5 }}>
          กราฟ = ข้อมูลสดจริง · ตัวเลข valuation/งบเป็นภาพประกอบกรอบวิเคราะห์ (snapshot) — production จะดึงจาก EDGAR / settrade / provider
        </div>
      </div>
    </div>
  );
}
