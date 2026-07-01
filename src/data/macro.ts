import type { Tripwire, BBPoint } from '../types';
import { C } from '../theme';

// ── Weekly Macro — Hartnett "The Flow Show" lens ───────────────────────
// ข้อมูลสกัด-ยืนยันแล้วจาก corpus 4 ฉบับ (Verified Citations 2026-06-30)
// D Bidterms 14พค · A Ground Control 22พค · B Wealth Up Biz 5มิย · C Small is Big 25มิย

export const ASOF = '30 มิถุนายน 2026';
export const THEME = '"Small is Big"';
export const THEME_DATE = '25 มิ.ย.';
export const REGIME = 'Reflation';
export const REGIME_TILT = 'Cyclicals · Energy · Commodity · Value';

// Regime 4-box (Growth × Inflation) — active = Reflation
export const REGIME_BOXES = [
  { name: 'Goldilocks', active: false },
  { name: 'Reflation ●', active: true },
  { name: 'Deflation', active: false },
  { name: 'Stagflation', active: false },
];

// Bull & Bear — เลขจริงจาก corpus (ไม่ใช่ proxy): เดินจริง 4 สัปดาห์
// 7.6 (14พค) → 8.0 sell triggered (22พค) → 8.7 (5มิย) → 9.1 (25มิย)
export const BB_CURRENT = 9.1;
export const BB_TRAJECTORY: BBPoint[] = [
  { label: '14พค', v: 7.6 },
  { label: '22พค', v: 8.0 },
  { label: '5มิย', v: 8.7 },
  { label: '25มิย', v: 9.1 },
];
export const BB_NOTE = 'ใน Sell zone ลึก (>8.0) · FMS Positioning แตะเพดาน 100%';

// Macro snapshot (FRED 2026-06-30) — dgs10 อัปเดตได้จาก live
export const MACRO_STATS = {
  cpi: '4.27%',
  dgs10: '4.38',
  fed: '3.63',
  payrolls: '+172k',
};

// BofA Private Clients %AUM (C, 25มิย: 65.7/9.6/17.3 → ปัด)
export const PRIVATE_CLIENTS = [
  { label: 'Equity', pct: 66, color: C.red, note: 'record high' },
  { label: 'Cash', pct: 10, color: C.gold, note: 'record low' },
  { label: 'Bond', pct: 17, color: C.bond, note: '' },
];

// Flows — ฉบับ Small is Big (25มิย): tech RECORD outflow, US stocks 1st outflow since Mar'26
export const FLOWS = [
  { icon: '▼', color: C.red, text: 'Tech −$9.3bn record outflow (หลัง record inflow)' },
  { icon: '▼', color: C.red, text: 'US stocks −$8.5bn · 1st outflow ตั้งแต่ มี.ค.' },
  { icon: '●', color: C.gold, text: 'Energy −$1.5bn (มากสุดตั้งแต่ เม.ย.) · defensive ก่อตัว' },
];

// Asset-price tripwires ("X to $price = event") — ตรวจสดได้จาก TradingView symbol
export const TRIPWIRES: Tripwire[] = [
  { label: 'MAGS', level: '< $60', tv: 'AMEX:MAGS', meaning: 'mega-cap AI นำลง → summer risk-off' },
  { label: 'AUDJPY', level: '< 110', tv: 'FX:AUDJPY', meaning: 'carry unwind → risk-off catalyst' },
  { label: '30Y UST', level: '> 5%', tv: 'TVC:US30Y', meaning: 'bond vigilantes → booms end' },
  { label: 'Gold', level: '< $4k = ซื้อ', tv: 'TVC:GOLD', meaning: 'จุดเข้า ไม่ใช่ยอด · "USD a rent"' },
];

// Analog rule (verified, A/B Table 2) — CPI>4% base rate
export const ANALOG = {
  rule: 'กฎ CPI > 4% → SPX เฉลี่ย',
  hi: '−3.5% ใน 3 เดือน',
  rest: ', −6.6% ใน 6 เดือน (data 11 เหตุการณ์ตั้งแต่ 1934)',
  // ⚔️ ขอบเขตเชิงทฤษฎี (JRT-grounded): Taleb เตือน base-rate ใน Extremistan
  caveat: 'base rate = inductive edge ใน Extremistan (Taleb) — probability ไม่ใช่คำพยากรณ์',
};

// Stance — decision logic 3 ช่วง
export const STANCE = [
  { phase: 'ก่อน trigger', text: 'ถือ max risk — "long & paranoid"' },
  { phase: 'ที่ trigger', text: 'take profit · หมุนเข้า defensive/value' },
  { phase: 'structural', text: 'long EM>US + commodity · "Small is Big" small-cap' },
];
