import { C, F } from '../theme';
import { NEWS, NEWS_SOURCES } from '../data/news';

export default function NewsInput() {
  return (
    <div id="news" style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 17, padding: 20, display: 'flex', flexDirection: 'column', scrollMarginTop: 130 }}>
      <div style={{ fontFamily: F.brand, fontWeight: 700, fontSize: 16, color: C.head, marginBottom: 3 }}>News Input</div>
      <p style={{ margin: '0 0 14px', fontSize: 11, color: C.faint2, lineHeight: 1.4 }}>ตัดบทวิเคราะห์/พยากรณ์ออก — เหลือข้อเท็จจริงตรวจสอบได้ + ระบุแหล่งน่าเชื่อถือสูง</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
        {NEWS.map((n, i) => (
          <div key={i} style={{ border: `1px solid ${C.borderSoft}`, borderRadius: 12, padding: '11px 13px', background: C.cardInset2 }}>
            <div style={{ display: 'flex', gap: 6, alignItems: 'center', marginBottom: 5 }}>
              <span style={{ fontFamily: F.mono, fontSize: 8.5, color: n.badgeColor, background: n.badgeBg, padding: '1px 6px', borderRadius: 4 }}>{n.source}</span>
              <span style={{ fontFamily: F.mono, fontSize: 8.5, color: C.faint }}>{n.meta}</span>
            </div>
            <div style={{ fontSize: 12, color: '#cfd1d6', lineHeight: 1.4 }}>{n.text}</div>
          </div>
        ))}
      </div>
      <div style={{ marginTop: 'auto', paddingTop: 12, fontFamily: F.mono, fontSize: 9, color: C.faint3, lineHeight: 1.5 }}>{NEWS_SOURCES}</div>
    </div>
  );
}
