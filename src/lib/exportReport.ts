import { REPORT_BOXES, STANCE_PARAGRAPH } from '../data/report';

const esc = (s: string) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

// สร้าง standalone HTML รายงานสัปดาห์ → ดาวน์โหลดเป็นไฟล์
export function exportReportHtml() {
  const rows = REPORT_BOXES.map(
    (b) => `<tr><td class="n">${esc(b.n)}</td><td><div class="t">${esc(b.t)}</div><div class="v">${esc(b.v)}</div></td></tr>`,
  ).join('');

  const html = `<!doctype html><html lang="th"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>MERIDIAN — Weekly Macro 2026-06-30</title>
<style>body{font-family:-apple-system,'Segoe UI',Tahoma,sans-serif;color:#1b1c20;background:#f3f2ef;margin:0;padding:32px}
.sheet{max-width:820px;margin:0 auto;background:#fff;border-radius:8px;box-shadow:0 10px 40px rgba(0,0,0,.12);padding:46px 52px}
.hd{display:flex;justify-content:space-between;align-items:center;border-bottom:2px solid #1b1c20;padding-bottom:14px;margin-bottom:10px}
.brand{font-weight:800;letter-spacing:.1em;font-size:16px}.sub{font-size:11px;color:#76757c}
.tag{display:inline-block;font-size:11px;color:#9a7b2e;background:#f3efe3;border:1px solid #e6dcc2;border-radius:6px;padding:3px 10px;margin:14px 0 18px}
table{width:100%;border-collapse:collapse}td{padding:9px 0;border-bottom:1px solid #ececec;vertical-align:top}
td.n{width:34px;color:#5b4fd0;font-weight:700;font-family:monospace}.t{font-weight:600;font-size:13px}.v{font-size:12.5px;color:#54545a;margin-top:2px;line-height:1.5}
.stance{margin-top:22px;padding:16px 18px;background:#faf9f6;border:1px solid #ece9e0;border-radius:10px;font-size:12.5px;line-height:1.65}
.ft{margin-top:18px;font-size:9.5px;color:#a3a2a8;line-height:1.6}h1{font-size:18px;margin:0}</style></head>
<body><div class="sheet">
<div class="hd"><div><div class="brand">MERIDIAN</div><div class="sub">Weekly Macro — The Flow Show framework</div></div><div style="text-align:right;font-family:monospace;font-size:11px;color:#76757c">30 มิ.ย. 2026<br>"Small is Big"</div></div>
<div class="tag">REGIME · REFLATION · Bull&amp;Bear 9.1/10 → take-profit bias</div>
<h1>11-Box Checklist</h1>
<table>${rows}</table>
<div class="stance"><b>STANCE — จุดยืนสัปดาห์นี้</b><br>${esc(STANCE_PARAGRAPH)}</div>
<div class="ft">sources · FRED (verified 2026-06-30) · BofA Flow Show framework · Ken French factor library · JPM/UBS/BofA/SET · decision-support เท่านั้น ไม่ใช่คำแนะนำซื้อขาย</div>
</div></body></html>`;

  const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'MERIDIAN_Weekly_Macro_2026-06-30.html';
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(a.href), 3000);
}
