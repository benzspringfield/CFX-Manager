import { useEffect, useRef } from 'react';
import type { CfxPick, Daily } from '../cfx';
import { C, F } from '../theme';
import { stockLeftHTML, stockFullHTML, tierColor, tierBg, hasRedFlag } from '../lib/cfxReport';
import { injectWidget, TV_ADV, drawerConfig } from '../lib/tradingview';

export default function CfxStockModal({ pick, daily, onClose }: { pick: CfxPick; daily: Daily; onClose: () => void }) {
  const leftRef = useRef<HTMLDivElement>(null);
  const rightRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    const t = setTimeout(() => {
      const el = document.getElementById('dd-chart');
      if (!el) return;
      if (pick.tv) injectWidget(el, TV_ADV, drawerConfig(pick.tv));
      else el.innerHTML = '<div style="display:flex;height:100%;align-items:center;justify-content:center;color:#54565e;font-size:12px;">ไม่มีกราฟ</div>';
    }, 160);
    if (leftRef.current) leftRef.current.scrollTop = 0;
    if (rightRef.current) rightRef.current.scrollTop = 0;
    return () => { clearTimeout(t); document.body.style.overflow = ''; };
  }, [pick.tk]);

  const red = hasRedFlag(pick);

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 45, background: C.bg }}>
      <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 11, padding: '12px 22px', borderBottom: `1px solid ${C.border}`, background: C.drawer, flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
            <span style={{ fontFamily: F.mono, fontWeight: 600, fontSize: 19, color: C.head2 }}>{pick.tk}</span>
            <span style={{ fontSize: 12, color: '#cfd1d6', maxWidth: 240, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{pick.name}</span>
            <span style={{ fontFamily: F.mono, fontSize: 10, color: C.sub, background: C.chip, padding: '2px 8px', borderRadius: 6 }}>{pick.mkt}</span>
            <span style={{ fontFamily: F.mono, fontSize: 10, fontWeight: 600, color: tierColor(pick.tier), background: tierBg(pick.tier), border: `1px solid ${tierColor(pick.tier)}55`, padding: '2px 8px', borderRadius: 6 }}>อันดับ #{pick.rank} · Tier {pick.tier}</span>
            {red && <span style={{ fontSize: 10, color: '#fff', background: C.red, padding: '2px 8px', borderRadius: 6 }}>🚩 มีธงแดง</span>}
          </div>
          <button onClick={onClose} style={{ marginLeft: 'auto', cursor: 'pointer', background: C.cardInset, border: '1px solid rgba(255,255,255,.12)', color: '#dcdee2', borderRadius: 9, padding: '8px 16px', fontSize: 13, fontWeight: 600 }}>✕ ปิด</button>
        </div>
        <div id="stockCols" style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
          <div ref={leftRef} style={{ width: '50%', overflowY: 'auto', padding: '22px 28px 60px', borderRight: `1px solid ${C.border}` }}
            dangerouslySetInnerHTML={{ __html: stockLeftHTML(pick) }} />
          <div ref={rightRef} style={{ width: '50%', overflowY: 'auto', background: '#0e1015' }}>
            <div style={{ position: 'sticky', top: 0, zIndex: 1, background: '#0e1015', padding: '13px 26px', borderBottom: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', gap: 9 }}>
              <span style={{ fontFamily: F.brand, fontWeight: 700, fontSize: 13.5, color: C.goldLt }}>📑 บทวิเคราะห์เจาะรายตัว — {pick.tk}</span>
              <span style={{ fontFamily: F.mono, fontSize: 9, color: C.faint }}>{pick.name}</span>
            </div>
            <div dangerouslySetInnerHTML={{ __html: stockFullHTML(pick, daily) }} />
          </div>
        </div>
      </div>
    </div>
  );
}
