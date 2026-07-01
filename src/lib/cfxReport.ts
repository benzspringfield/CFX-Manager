// CFX report/HTML builders — port จาก preview.html (ใช้กับ dangerouslySetInnerHTML)
import type { CfxPick, Daily, Consensus, FullAnalysis } from '../cfx';

export const tierColor = (t?: string) => (t === 'A' ? '#4ec98a' : t === 'B' ? '#d2a64a' : '#7e8088');
export const tierBg = (t?: string) => (t === 'A' ? 'rgba(78,201,138,.14)' : t === 'B' ? 'rgba(210,166,74,.14)' : 'rgba(126,128,136,.14)');
export const dotColor = (s?: string) => (/Buy|Accumulate/i.test(s || '') ? '#4ec98a' : /Hold/i.test(s || '') ? '#d2a64a' : '#9a9da6');
export const hasRedFlag = (p: CfxPick) => (p.cutTriggers || []).some((c) => c.triggered);

const sT = (t: string) => '<div class="brand" style="font-weight:700;font-size:13.5px;color:#e0bd6f;margin:0 0 9px;">' + t + '</div>';
const sH = (t: string) => '<div class="mono" style="font-size:9px;color:#6b6e78;letter-spacing:.07em;margin:18px 0 8px;">' + t + '</div>';
const para = (t?: string) => '<div style="font-size:12px;color:#c5c7cf;line-height:1.7;margin-bottom:16px;">' + (t || '—') + '</div>';
const box = (l: string, v?: string, c?: string) => '<div style="background:#1b1f27;text-align:center;padding:11px 4px;border-radius:11px;"><div class="mono" style="font-size:9px;color:#6b6e78;">' + l + '</div><div class="mono" style="font-size:14px;color:' + c + ';margin-top:3px;">' + (v || '—') + '</div></div>';
const hz = (label: string, sub: string, color: string, text?: string) => '<div style="display:flex;gap:11px;align-items:flex-start;background:#1b1f27;border-left:3px solid ' + color + ';border-radius:9px;padding:9px 12px;margin-bottom:7px;"><div style="min-width:46px;"><div style="font-size:12px;font-weight:600;color:' + color + ';">' + label + '</div><div class="mono" style="font-size:8px;color:#6b6e78;">' + sub + '</div></div><div style="font-size:11.5px;color:#cfd1d6;line-height:1.5;">' + (text || '—') + '</div></div>';

export function researchLink(p: CfxPick): { label: string; url: string } {
  if (p.mkt === 'TH') return { label: 'Settrade — Analyst Consensus (' + p.tk + ')', url: 'https://www.settrade.com/th/equities/quote/' + p.tk + '/analyst-consensus' };
  return { label: p.research?.label || '—', url: p.research?.url || '#' };
}

const consUrl = (tk: string, src?: string) =>
  src === 'st' ? 'https://www.settrade.com/th/equities/quote/' + tk + '/analyst-consensus'
    : src === 'fv' ? 'https://finviz.com/quote.ashx?t=' + tk.replace('.', '-')
      : src === 'yh' ? 'https://finance.yahoo.com/quote/' + tk.replace('.JP', '.T') : '#';
const srcLabel = (src?: string) => (src === 'st' ? 'Settrade · IAA' : src === 'fv' ? 'Finviz' : src === 'yh' ? 'Yahoo Finance' : '');
const ratingFromRecom = (r: number) => (r < 1.5 ? 'Strong Buy' : r < 2.5 ? 'Buy' : r < 3.5 ? 'Hold' : r < 4.5 ? 'Sell' : 'Strong Sell');

export function consensusBlock(tk: string, daily: Daily): string {
  const c: Consensus | undefined = daily.consensus && daily.consensus[tk];
  if (!c) return '';
  const url = consUrl(tk, c.src); const lbl = srcLabel(c.src);
  if (c.linkOnly) {
    return sT('📊 Analyst Consensus (' + lbl + ')') +
      '<div style="background:#1b1f27;border-radius:11px;padding:13px 15px;margin-bottom:16px;">' +
      '<div style="font-size:11px;color:#cbb890;line-height:1.55;margin-bottom:10px;">⚠️ ดึงอัตโนมัติยังไม่ได้ (Yahoo/Morningstar บล็อก bot) — เปิดดู consensus/ราคาเป้าหมายบนหน้าได้โดยตรง · engine จริงจะดึงผ่าน API</div>' +
      '<a href="' + url + '" target="_blank" style="display:inline-flex;align-items:center;gap:7px;background:#14171e;border:1px solid rgba(255,255,255,.12);border-radius:9px;padding:9px 14px;color:#cfd1d6;font-size:12px;">🔗 เปิด ' + lbl + ' (' + tk + ') →</a></div>';
  }
  const rating = (c.rating && c.rating !== 'n/a') ? c.rating : (c.recom != null ? ratingFromRecom(c.recom) : 'n/a');
  const rc = /Buy/i.test(rating) ? '#4ec98a' : /Hold/i.test(rating) ? '#d2a64a' : /Sell/i.test(rating) ? '#e0594e' : '#7e8088';
  const cur = c.cur || '';
  const meta: string[] = [];
  if (c.n) meta.push(c.n + ' โบรก');
  if (c.recom != null) meta.push('Recom ' + c.recom + '/5');
  if (c.bull != null) meta.push('Bullish ' + c.bull + '%');
  let bar = '';
  if (c.b != null) {
    const tot = (c.b + (c.h || 0) + (c.s || 0)) || 1;
    bar = '<div style="display:flex;height:7px;border-radius:4px;overflow:hidden;background:#23262f;margin:9px 0;">' +
      (c.b ? '<div style="width:' + (c.b / tot * 100) + '%;background:#4ec98a;"></div>' : '') +
      (c.h ? '<div style="width:' + (c.h / tot * 100) + '%;background:#d2a64a;"></div>' : '') +
      (c.s ? '<div style="width:' + (c.s / tot * 100) + '%;background:#e0594e;"></div>' : '') +
      '</div><div class="mono" style="font-size:10px;color:#8a8d96;margin-bottom:9px;">ซื้อ ' + c.b + ' · ถือ ' + c.h + ' · ขาย ' + c.s + '</div>';
  }
  const cell = (l: string, v?: number, col?: string) => '<div style="text-align:center;background:#14171e;border-radius:9px;padding:8px 4px;"><div class="mono" style="font-size:8.5px;color:#6b6e78;">' + l + '</div><div class="mono" style="font-size:14px;color:' + col + ';">' + cur + v + '</div></div>';
  const targets = (c.hi != null)
    ? '<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:8px;">' + cell('เป้าเฉลี่ย', c.tgt, '#f0f1f4') + cell('สูงสุด', c.hi, '#4ec98a') + cell('ต่ำสุด', c.lo, '#e0594e') + '</div>'
    : (c.tgt != null ? '<div style="display:grid;grid-template-columns:1fr;gap:8px;">' + cell('ราคาเป้าหมาย (เฉลี่ย)', c.tgt, '#f0f1f4') + '</div>' : '');
  return sT('📊 Analyst Consensus (' + lbl + ')') +
    '<div style="background:#1b1f27;border-radius:11px;padding:13px 15px;margin-bottom:16px;">' +
    '<div style="display:flex;align-items:center;gap:10px;flex-wrap:wrap;margin-bottom:2px;">' +
    '<span style="font-size:13px;font-weight:700;color:' + rc + ';">' + rating + '</span>' +
    '<span class="mono" style="font-size:10px;color:#9a9da6;">' + meta.join(' · ') + '</span>' +
    '<a href="' + url + '" target="_blank" class="mono" style="margin-left:auto;font-size:10px;color:#7e88a8;">เปิดหน้า ' + lbl + ' →</a>' +
    '</div>' + bar +
    (c.note ? '<div class="mono" style="font-size:10px;color:#cbb890;margin-bottom:9px;">' + c.note + '</div>' : '') + targets +
    '<div class="mono" style="font-size:9px;color:#54565e;margin-top:8px;">ที่มา: ' + lbl + ' · ' + (daily.consensusAsof || '') + '</div></div>';
}

// ครึ่งซ้าย — snapshot (chart + strategy + horizons + red flags)
export function stockLeftHTML(p: CfxPick): string {
  const st = p.strategy || {};
  return '<div class="mono" style="font-size:10px;color:#8a8d96;margin-bottom:14px;">วิธีซื้อ: ' + p.access + '</div>' +
    '<div id="dd-chart" style="height:300px;border:1px solid rgba(255,255,255,.07);border-radius:13px;overflow:hidden;background:#0d1016;"></div>' +
    sH('ทำไมน่าสนใจ (สรุป)') + '<div style="font-size:12.5px;color:#dcdee2;line-height:1.6;">' + p.why + '</div>' +
    '<div class="mono" style="font-size:10px;color:#7e88a8;background:rgba(124,108,240,.08);border:1px solid rgba(124,108,240,.2);border-radius:8px;padding:9px 12px;margin:14px 0;">📑 บทวิเคราะห์เจาะรายตัวฉบับเต็ม อยู่คอลัมน์ขวา →</div>' +
    sH('🚩 ธงแดง — เกิดแล้วต้องคัตทันที') +
    '<div style="display:flex;flex-direction:column;gap:7px;">' + (p.cutTriggers || []).map((c) =>
      c.triggered
        ? '<div style="display:flex;gap:9px;align-items:flex-start;background:rgba(224,89,78,.13);border:1px solid rgba(224,89,78,.5);border-radius:10px;padding:9px 11px;"><span>🚩</span><div><span style="font-size:9px;color:#fff;background:#e0594e;padding:1px 6px;border-radius:4px;">เกิดแล้ว · คัต</span><div style="font-size:12px;color:#f0b8b2;line-height:1.45;margin-top:4px;">' + c.t + '</div></div></div>'
        : '<div style="display:flex;gap:9px;align-items:flex-start;border:1px solid rgba(255,255,255,.08);border-radius:10px;padding:9px 11px;"><span style="color:#6b6e78;">○</span><div><span class="mono" style="font-size:8.5px;color:#6b6e78;">เฝ้าดู</span><div style="font-size:12px;color:#b6b8c0;line-height:1.45;margin-top:2px;">' + c.t + '</div></div></div>'
    ).join('') + '</div>' +
    sH('กลยุทธ์ซื้อ-ขาย (' + (p.level === 'live' ? 'live' : 'EOD framework') + ')') +
    '<div style="background:#1b1f27;border-radius:11px;padding:11px 13px;margin-bottom:8px;font-size:12px;color:#dcdee2;"><b style="color:#c3b8fa;">' + st.bias + '</b> — ' + st.note + '</div>' +
    '<div style="display:grid;grid-template-columns:repeat(4,1fr);gap:8px;">' + box('เข้า', st.entry, '#e8eaed') + box('คัทลอส', st.stop, '#e0594e') + box('เป้า', st.target, '#4ec98a') + box('R:R', st.rr, '#a98cff') + '</div>' +
    sH('⏱️ กลยุทธ์ตามกรอบเวลา') +
    (p.horizons ? (hz('สั้น', 'วัน–สัปดาห์', '#5b8dbe', p.horizons.short) + hz('กลาง', '1–6 เดือน', '#a98cff', p.horizons.medium) + hz('ยาว', '1 ปี+', '#4ec98a', p.horizons.long)) : '') +
    '<div style="margin-top:18px;font-size:10px;color:#54565e;line-height:1.5;">ราคา=EOD framework · ธงแดง triggered เมื่อ engine รัน live · บทวิเคราะห์เต็ม + ลิงก์ Settrade/แหล่งอ้างอิง อยู่คอลัมน์ขวา →</div>';
}

// ครึ่งขวา — บทวิเคราะห์เจาะรายตัว
export function stockFullHTML(p: CfxPick, daily: Daily): string {
  const a = p.amorn || {}; const rl = researchLink(p);
  const macro = (p.pillars || []).filter((x) => /Macro|Hartnett|Regime|oligopoly|moat|commodity|EM/i.test(x));
  const redCount = (p.cutTriggers || []).filter((c) => c.triggered).length;
  const tilt = daily.regimeTilt || '';
  return '<div style="padding:20px 26px 50px;">' +
    sT('🎯 บทสรุปการลงทุน') +
    '<div style="background:#1b1f27;border-left:3px solid ' + tierColor(p.tier) + ';border-radius:9px;padding:12px 14px;margin-bottom:16px;">' +
    '<div style="font-size:12.5px;color:#dcdee2;line-height:1.65;">' + p.why + '</div>' +
    '<div class="mono" style="font-size:10px;color:#9a9da6;margin-top:8px;">อันดับ #' + p.rank + ' · Tier ' + p.tier + ' · จุดยืน: <b style="color:' + tierColor(p.tier) + ';">' + (p.strategy?.bias || '') + '</b>' + (redCount ? ' · <span style="color:#e0594e;">🚩 ธงแดงเกิดแล้ว ' + redCount + ' จุด</span>' : '') + '</div></div>' +
    sT('🏢 ธุรกิจ & ความได้เปรียบเชิงแข่งขัน') + para(a.business) +
    sT('📈 คุณภาพการเติบโต') + para(a.growth) +
    sT('💰 การประเมินมูลค่า (Valuation)') + para(a.valuation) +
    consensusBlock(p.tk, daily) +
    sT('🧾 คุณภาพงบการเงิน & Forensic gate') + para(a.financials) +
    sT('🏛️ เสาความรู้ JRT — วิธี/บทที่ใช้ประเมิน') +
    (p.jrt || []).map((j) => '<div class="jrt">' + j + '</div>').join('') +
    sT('🌐 หุ้นนี้กับภาวะตลาดปัจจุบัน') +
    para('regime ปัจจุบัน = <b style="color:#e0bd6f;">' + daily.regime + '</b> · tilt ตลาด: ' + tilt + '. ' + (macro.length ? 'หุ้นนี้เชื่อมกับ regime ผ่าน: ' + macro.join(' · ') : 'เป็น bottom-up เป็นหลัก ไม่ผูก regime โดยตรง') + '.') +
    sT('⚖️ มุมความเสี่ยง & วินัยคัต') +
    '<div style="font-size:11.5px;color:#cbb890;line-height:1.6;margin-bottom:9px;"><b>จุดเฝ้าระวัง:</b> ' + ((p.watchpoints || []).join(' · ') || '—') + '</div>' +
    '<div style="font-size:11.5px;color:#cfd1d6;line-height:1.6;"><b>วินัยคัต (Amorn):</b> Stop loss เด็ดขาด · "อย่าเด็ดดอกไม้รดน้ำวัชพืช" (ตัด loser เร็ว ถือ winner ห้ามถัว) · ตลาดไทยมีเจ้ามือ ราคามักลงนำงบ → ใช้ price action เป็นสัญญาณเตือน</div>' +
    sT('เสาที่ใช้ & แหล่งอ้างอิง') +
    '<div style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:12px;">' + (p.pillars || []).map((x) => '<span class="chip">' + x + '</span>').join('') + '</div>' +
    '<a href="' + rl.url + '" target="_blank" style="display:inline-flex;align-items:center;gap:7px;background:#1b1f27;border:1px solid rgba(255,255,255,.12);border-radius:10px;padding:9px 14px;color:#cfd1d6;font-size:12px;">📄 ' + rl.label + ' →</a>' +
    '<div style="margin-top:16px;font-size:9.5px;color:#54565e;line-height:1.5;">เสา JRT = method จาก textbook เชิงคุณภาพ (ตัวเลขจริงเมื่อ engine ดึงงบ) · ราคา=EOD framework · decision-support ไม่ใช่คำแนะนำซื้อขาย</div></div>';
}

// บทวิเคราะห์ฉบับเต็มต่อตลาด (modal บรีฟ) — render เฉพาะส่วนที่ full มี
export function faBodyHTML(f?: FullAnalysis): string {
  if (!f) return '';
  let parts = '';
  if (f.regime || f.bullBear) {
    parts += '<div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:20px;">';
    if (f.regime) parts += '<div class="card" style="background:#1b1f27;padding:15px;"><div class="mono" style="font-size:9px;color:#6b6e78;margin-bottom:9px;">REGIME · GROWTH × INFLATION</div><div style="display:grid;grid-template-columns:1fr 1fr;gap:5px;">' + (f.regime.box || []).map((x) => { const on = /●/.test(x); return '<div style="border-radius:8px;padding:8px;font-size:10px;text-align:center;background:' + (on ? '#d2a64a' : '#23262f') + ';color:' + (on ? '#1a1306' : '#71747e') + ';font-weight:' + (on ? 700 : 400) + ';">' + x + '</div>'; }).join('') + '</div><div style="font-size:10.5px;color:#9a9da6;margin-top:10px;">→ tilt: ' + (f.regime.tilt || '') + '</div></div>';
    if (f.bullBear) { const bb = f.bullBear; const pct = Math.min(100, bb.value * 10); const traj = bb.trajectory.map((t, i) => '<span class="mono" style="font-size:11px;color:' + (i === bb.trajectory.length - 1 ? '#e0594e' : '#9a9da6') + ';">' + t[1].toFixed(1) + '</span>' + (i < bb.trajectory.length - 1 ? ' <span style="color:#54565e;">→</span> ' : '')).join(''); parts += '<div class="card" style="background:#1b1f27;padding:15px;"><div style="display:flex;justify-content:space-between;"><span class="mono" style="font-size:9px;color:#6b6e78;">BULL &amp; BEAR</span><span class="mono" style="font-size:17px;color:#e0594e;font-weight:600;">' + bb.value + '</span></div><div style="height:7px;border-radius:4px;margin:11px 0 7px;background:linear-gradient(90deg,#4ec98a,#d2a64a,#e0594e);position:relative;"><span style="position:absolute;top:-3px;left:' + pct + '%;height:13px;width:3px;border-radius:2px;background:#f0f1f4;box-shadow:0 0 0 2px #1b1f27;"></span></div><div style="margin-bottom:8px;">' + traj + '</div><div style="font-size:10px;color:#9a9da6;line-height:1.45;">' + (bb.note || '') + '</div></div>'; }
    parts += '</div>';
  }
  if (f.tripwires) parts += sT('🎯 Tripwires (X to $price = event)') + '<div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:18px;">' + f.tripwires.map((t) => '<div style="background:#1b1f27;border-radius:10px;padding:10px 12px;display:flex;align-items:center;gap:9px;"><span class="mono" style="font-size:12px;color:#f0f1f4;font-weight:600;min-width:62px;">' + t.label + '</span><span class="mono" style="font-size:11px;color:#e0bd6f;">' + t.level + '</span><span style="font-size:10px;color:#9a9da6;margin-left:auto;text-align:right;">' + t.meaning + '</span></div>').join('') + '</div>';
  if (f.flows) parts += sT('💧 Flows / Positioning') + '<div style="display:flex;flex-direction:column;gap:6px;margin-bottom:18px;">' + f.flows.map((x) => '<div style="font-size:11.5px;color:#cfd1d6;line-height:1.5;">• ' + x + '</div>').join('') + '</div>';
  if (f.analog) parts += sT('📐 Analog (base rate)') + '<div style="background:rgba(224,89,78,.08);border:1px solid rgba(224,89,78,.22);border-radius:11px;padding:12px 14px;margin-bottom:18px;"><div style="font-size:11.5px;color:#e8c4c0;line-height:1.55;">' + (f.analog.text || '') + '</div><div style="font-size:10.5px;color:#9a8884;margin-top:7px;">' + (f.analog.caveat || '') + '</div></div>';
  if (f.stance) parts += sT('🧭 Stance (จุดยืน)') + '<div style="display:flex;flex-direction:column;gap:8px;margin-bottom:18px;"><div style="background:#1b1f27;border-radius:11px;padding:11px 13px;"><div style="font-size:10px;color:#8a8d96;margin-bottom:4px;">ก่อน/สะสม</div><div style="font-size:11.5px;color:#dcdee2;line-height:1.4;">' + (f.stance.before || '') + '</div></div><div style="background:#1b1f27;border-radius:11px;padding:11px 13px;"><div style="font-size:10px;color:#8a8d96;margin-bottom:4px;">ที่ trigger</div><div style="font-size:11.5px;color:#dcdee2;line-height:1.4;">' + (f.stance.at || '') + '</div></div><div style="background:#1b1f27;border-radius:11px;padding:11px 13px;"><div style="font-size:10px;color:#8a8d96;margin-bottom:4px;">structural</div><div style="font-size:11.5px;color:#dcdee2;line-height:1.4;">' + (f.stance.structural || '') + '</div></div></div>';
  if (f.sections) parts += f.sections.map((s) => sT(s.h) + '<div style="font-size:11.5px;color:#c5c7cf;line-height:1.65;margin-bottom:16px;">' + s.body + '</div>').join('');
  parts += '<div style="border-top:1px solid rgba(255,255,255,.08);margin-top:8px;padding-top:14px;" class="mono"><span style="font-size:9.5px;color:#6b6e78;">แหล่ง: ' + (f.sources || []).join(' · ') + '</span></div><div style="margin-top:10px;font-size:9.5px;color:#54565e;">decision-support เท่านั้น ไม่ใช่คำแนะนำซื้อขาย</div>';
  return '<div style="padding:22px 26px;">' + parts + '</div>';
}
