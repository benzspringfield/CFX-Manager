import { F } from '../theme';
import { REPORT_BOXES, STANCE_PARAGRAPH } from '../data/report';
import { exportReportHtml } from '../lib/exportReport';

export default function WeeklyReport({ onBack }: { onBack: () => void }) {
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 50, overflowY: 'auto', background: '#2a2c33' }}>
      <div className="no-print" style={{ position: 'sticky', top: 0, display: 'flex', alignItems: 'center', gap: 12, padding: '12px 20px', background: '#15171c', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
        <button onClick={onBack} style={{ cursor: 'pointer', background: '#23262f', border: '1px solid rgba(255,255,255,0.12)', color: '#dcdee2', borderRadius: 9, padding: '8px 14px', fontFamily: F.thai, fontSize: 12.5 }}>‹ กลับแดชบอร์ด</button>
        <span style={{ fontFamily: F.brand, fontWeight: 700, fontSize: 14, color: '#f0f1f4' }}>รายงานมหภาครายสัปดาห์</span>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
          <button onClick={exportReportHtml} style={{ cursor: 'pointer', background: '#23262f', border: '1px solid rgba(255,255,255,0.14)', color: '#dcdee2', borderRadius: 9, padding: '8px 15px', fontFamily: F.thai, fontSize: 12.5, fontWeight: 600 }}>⬇ ดาวน์โหลด HTML</button>
          <button onClick={() => window.print()} style={{ cursor: 'pointer', background: '#7c6cf0', border: 'none', color: '#fff', borderRadius: 9, padding: '8px 16px', fontFamily: F.thai, fontSize: 12.5, fontWeight: 600 }}>⤓ Print / บันทึก PDF</button>
        </div>
      </div>

      <div className="report-sheet" style={{ maxWidth: 820, margin: '26px auto', background: '#fff', color: '#1b1c20', borderRadius: 8, boxShadow: '0 30px 80px -30px rgba(0,0,0,0.6)', padding: '48px 54px', fontFamily: `${F.thai}, serif` }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '2px solid #1b1c20', paddingBottom: 14, marginBottom: 8 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ height: 30, width: 30, borderRadius: 8, background: 'linear-gradient(135deg,#5b4fd0,#8a6cf0)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontFamily: F.brand, fontWeight: 800, fontSize: 15 }}>M</div>
            <div>
              <div style={{ fontFamily: F.brand, fontWeight: 800, fontSize: 15, letterSpacing: '0.1em' }}>MERIDIAN</div>
              <div style={{ fontSize: 10, color: '#76757c' }}>Weekly Macro — The Flow Show framework</div>
            </div>
          </div>
          <div style={{ textAlign: 'right', fontFamily: F.mono, fontSize: 11, color: '#76757c' }}>30 มิ.ย. 2026<br />"Small is Big"</div>
        </div>
        <div style={{ display: 'inline-block', fontFamily: F.mono, fontSize: 11, color: '#9a7b2e', background: '#f3efe3', border: '1px solid #e6dcc2', borderRadius: 6, padding: '3px 10px', marginBottom: 18 }}>
          REGIME · REFLATION · Bull&amp;Bear 9.1/10 → take-profit bias
        </div>

        <h2 style={{ fontFamily: F.brand, fontWeight: 700, fontSize: 18, margin: '0 0 4px' }}>11-Box Checklist</h2>
        <p style={{ margin: '0 0 16px', fontSize: 12, color: '#76757c' }}>โครงถาวรของ Flow Show — เติมข้อมูลปัจจุบันลงทุกช่อง</p>

        {REPORT_BOXES.map((b) => (
          <div key={b.n} style={{ display: 'flex', gap: 13, padding: '9px 0', borderBottom: '1px solid #ececec' }}>
            <span style={{ fontFamily: F.mono, fontSize: 11, color: '#5b4fd0', width: 22, flexShrink: 0, fontWeight: 600 }}>{b.n}</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: F.brand, fontWeight: 600, fontSize: 12.5, color: '#1b1c20' }}>{b.t}</div>
              <div style={{ fontSize: 12, color: '#54545a', lineHeight: 1.5, marginTop: 2 }}>{b.v}</div>
            </div>
          </div>
        ))}

        <div style={{ marginTop: 22, padding: '16px 18px', background: '#faf9f6', border: '1px solid #ece9e0', borderRadius: 10 }}>
          <div style={{ fontFamily: F.brand, fontWeight: 700, fontSize: 13, marginBottom: 7 }}>STANCE — จุดยืนสัปดาห์นี้</div>
          <div style={{ fontSize: 12.5, color: '#33333a', lineHeight: 1.65 }}>{STANCE_PARAGRAPH}</div>
        </div>

        <div style={{ marginTop: 18, fontFamily: F.mono, fontSize: 9.5, color: '#a3a2a8', lineHeight: 1.6 }}>
          sources · FRED (verified 2026-06-30) · BofA Flow Show framework · Ken French factor library · JPM/UBS/BofA/SET · decision-support เท่านั้น ไม่ใช่คำแนะนำซื้อขาย
        </div>
      </div>
    </div>
  );
}
