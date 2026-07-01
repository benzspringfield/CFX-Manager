import { useEffect } from 'react';
import type { FullAnalysis } from '../cfx';
import { C, F } from '../theme';
import { faBodyHTML } from '../lib/cfxReport';

export default function CfxFullModal({ full, onClose }: { full: FullAnalysis; onClose: () => void }) {
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);
  return (
    <div onClick={onClose} style={{ position: 'fixed', inset: 0, zIndex: 50, background: 'rgba(6,7,11,.78)', backdropFilter: 'blur(5px)', overflowY: 'auto' }}>
      <div onClick={(e) => e.stopPropagation()} style={{ maxWidth: 880, margin: '34px auto', background: '#13161d', border: `1px solid ${C.border}`, borderRadius: 18, overflow: 'hidden' }}>
        <div style={{ background: 'linear-gradient(135deg,rgba(124,108,240,.18),rgba(210,166,74,.10))', padding: '24px 30px', borderBottom: `1px solid ${C.border}`, display: 'flex', alignItems: 'flex-start', gap: 12 }}>
          <div>
            <div style={{ fontFamily: F.brand, fontWeight: 800, fontSize: 19, color: C.head2 }}>{full.title}</div>
            <div style={{ fontFamily: F.mono, fontSize: 10.5, color: C.sub, marginTop: 5 }}>{full.asof}</div>
          </div>
          <button onClick={onClose} style={{ marginLeft: 'auto', cursor: 'pointer', background: 'rgba(0,0,0,.3)', border: '1px solid rgba(255,255,255,.15)', color: '#fff', height: 32, width: 32, borderRadius: 9, fontSize: 16 }}>✕</button>
        </div>
        <div dangerouslySetInnerHTML={{ __html: faBodyHTML(full) }} />
      </div>
    </div>
  );
}
