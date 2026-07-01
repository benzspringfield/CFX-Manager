import type { ReportBox } from '../types';

// 11-Box checklist — โครงถาวรของ Flow Show เติมข้อมูล verified (corpus 2026)
// ใช้ทั้งใน Weekly Report mode และ export HTML
export const REPORT_BOXES: ReportBox[] = [
  { n: '01', t: 'Scores on the Doors', v: 'oil 21.9% นำ YTD (พีค 76.6% เมื่อ 14พค) · gold พลิกลบ −7.2% · US$ แข็ง → regime = Reflation/late-cycle + "Iran/sanctions end & dollar pop"' },
  { n: '02', t: 'Zeitgeist', v: '"How far do hyperscalers need to fall for market to start trading capex cuts?" — ตลาดเริ่มสงสัยผู้นำ AI กลุ่มใหญ่' },
  { n: '03', t: 'The Biggest Picture', v: 'Boom loop ยังเดิน (household equity wealth +$6tn YTD) แต่ periphery เริ่มแตก · Warsh เริ่มงาน → USTs > stocks, "Anything But Bonds"' },
  { n: '04', t: 'The Price is Right', v: 'EM FX แตะ record low (KRW/IDR/INR) · gold <$4k = จุดเข้า "USD a rent not an own" · secular trade ยัง long EM > US' },
  { n: '05', t: 'Tale of the Tape', v: 'tripwires: MAGS <$60 · AUDJPY <110 · 30Y yield US>5%/UK>6%/JP>4% · CPI on course >5% by midterms (CPI>4% ✓ ทำงานแล้ว)' },
  { n: '06', t: 'Weekly Flows', v: 'Tech −$9.3bn record outflow · US stocks −$8.5bn (1st outflow since Mar) · IG bonds 2nd biggest inflow on record' },
  { n: '07', t: 'Flows to Know', v: 'เงินหมุนเข้า defensive (TIPS/munis/utilities) ขณะ tech ไหลออก = rotation + "long and paranoid"' },
  { n: '08', t: 'BofA Private Clients', v: 'Equity 66% (record high) · Cash 9.6% (record low) · Bond 17% → contrarian read: กระสุนหมด ระวังขาลง' },
  { n: '09', t: 'Bull & Bear Indicator', v: '9.1 / 10 — เดินจาก 7.6→8.0→8.7→9.1 · Sell zone ลึก · FMS Positioning แตะ 100% (เพดาน)' },
  { n: '10', t: 'Special Tables (Analog)', v: 'SOX 62% เหนือ 200dma (ฟองสบู่เฉลี่ย 35%) · CPI>4% → SPX เฉลี่ย −3.5%/3ด, −6.6%/6ด (1934–) ⚔️ Taleb: เป็น base rate ใน Extremistan ไม่ใช่คำพยากรณ์' },
  { n: '11', t: 'Stance / Recommendation', v: 'take profit ที่ trigger · หมุนเข้า value/defensive/small-cap ("Small is Big") · structural: EM + commodity = bull' },
];

// Stance paragraph (ใช้ใน report sheet + export)
export const STANCE_PARAGRAPH =
  'ก่อน trigger: ถือ max risk แบบ "long & paranoid" · ที่ trigger (CPI>4% ทำงานแล้ว, B&B 9.1 ใน sell zone): take profit หมุนเข้า defensive/value/small-cap · structural: EM + commodity = bull, "Small is Big" post-bubble rotation. tilt sector ตาม Reflation → Energy · Materials · Financials · Value';
