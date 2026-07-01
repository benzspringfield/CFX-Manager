import type { Framework } from '../types';
import { C } from '../theme';

// 6 stock-pick frameworks — จาก design handoff (snapshot 2026-06-30)
// ระดับราคา เข้า/คัทลอส/เป้า = ภาพประกอบกรอบเทรด · กราฟ = สดจาก TradingView
export const FRAMEWORKS: Framework[] = [
  {
    key: 'value',
    name: 'Value / DCF',
    sub: 'Intrinsic value · ROIC vs WACC · margin of safety',
    tilt: 'หามูลค่าที่แท้จริง ซื้อต่ำกว่ามูลค่าพร้อม margin of safety — เน้น ROIC จาก reinvestment จริง',
    assumptions: [
      'WACC 8–10% · terminal growth 2.5–3%',
      'ใช้ ROIC จาก reinvestment จริง ไม่ใช่ ROIC ในงบ',
      'ต้องมี margin of safety ≥ 25% ก่อนเข้า',
    ],
    picks: [
      { tk: 'BABA', mkt: 'CN', tv: 'NYSE:BABA', entry: '118', stop: '102', target: '145', rr: '1:1.7', dot: C.green, note: 'cloud margin ฟื้น · P/E ต่ำกว่าค่าเฉลี่ย 5 ปี', dd: { fv: '$145', up: '+23%', wacc: '9.5%', g: '3.0%', rev: '+11% YoY', mgn: '18%', roic: '12%', pe: '11x' } },
      { tk: 'GFPT', mkt: 'TH', tv: 'SET:GFPT', entry: '13.5', stop: '11.8', target: '18.0', rr: '1:2.6', dot: C.green, note: 'วงจรไก่ฟื้น · EV/EBITDA 6x', dd: { fv: '฿18.0', up: '+33%', wacc: '9.0%', g: '2.5%', rev: '+8% YoY', mgn: '9%', roic: '11%', pe: '9x' } },
      { tk: 'MSFT', mkt: 'US', tv: 'NASDAQ:MSFT', entry: '470', stop: '432', target: '540', rr: '1:1.8', dot: C.gold, note: 'capex หนัก — จับ ROIC · cloud +28%', dd: { fv: '$540', up: '+15%', wacc: '8.5%', g: '3.0%', rev: '+16% YoY', mgn: '45%', roic: '28%', pe: '34x' } },
      { tk: '8058', mkt: 'JP', tv: 'TSE:8058', entry: '3,180', stop: '2,860', target: '3,900', rr: '1:2.3', dot: C.green, note: 'Mitsubishi · P/B 0.9 · buyback', dd: { fv: '¥3,900', up: '+23%', wacc: '8.0%', g: '2.0%', rev: '+5% YoY', mgn: '—', roic: '10%', pe: '9x' } },
    ],
  },
  {
    key: 'minervini',
    name: 'Minervini Momentum',
    sub: 'SEPA · Trend Template · RS rating · VCP',
    tilt: 'ซื้อผู้นำตลาดที่เทรนด์ขาขึ้นชัด เข้าเฉพาะ pivot breakout จาก VCP คุมความเสี่ยงด้วย stop แคบ',
    assumptions: [
      'ราคา > MA50 > MA150 > MA200 · MA200 ชี้ขึ้น',
      'RS rating ≥ 80 · อยู่ใน 25% ของ 52-wk high',
      'เข้า pivot breakout · stop −7~8%',
    ],
    picks: [
      { tk: 'NVDA', mkt: 'US', tv: 'NASDAQ:NVDA', entry: '1,420', stop: '1,318', target: '1,690', rr: '1:2.6', dot: C.green, note: 'VCP 5 สัปดาห์ · volume แห้ง · RS 96', dd: { fv: '$1,690', up: '+19%', wacc: '9.0%', g: '4.0%', rev: '+60% YoY', mgn: '55%', roic: '60%', pe: '45x' } },
      { tk: 'AOT', mkt: 'TH', tv: 'SET:AOT', entry: '62', stop: '57', target: '74', rr: '1:2.4', dot: C.green, note: 'stage 2 · นักท่องเที่ยวฟื้น · RS 88', dd: { fv: '฿74', up: '+19%', wacc: '8.5%', g: '3.0%', rev: '+18% YoY', mgn: '40%', roic: '12%', pe: '28x' } },
      { tk: '8035', mkt: 'JP', tv: 'TSE:8035', entry: '38,400', stop: '35,200', target: '46,000', rr: '1:2.4', dot: C.green, note: 'Tokyo Electron · semicap leader · RS 91', dd: { fv: '¥46,000', up: '+20%', wacc: '8.5%', g: '3.5%', rev: '+22% YoY', mgn: '28%', roic: '24%', pe: '30x' } },
      { tk: '600519', mkt: 'CN', tv: 'SSE:600519', entry: '1,540', stop: '1,430', target: '1,820', rr: '1:2.5', dot: C.gold, note: 'Moutai · consumer leader · base ตึง', dd: { fv: '¥1,820', up: '+18%', wacc: '9.0%', g: '3.0%', rev: '+12% YoY', mgn: '67%', roic: '32%', pe: '24x' } },
    ],
  },
  {
    key: 'factor',
    name: 'Factor / Quant',
    sub: 'Value + Momentum + Quality · Ken French',
    tilt: 'snapshot 2026-04: HML +9.2% (value นำ) · RMW −11.2% · SMB +6.5% → tilt value+size ระวัง low-quality',
    assumptions: [
      'rebalance รายเดือน · equal-weight decile บนสุด',
      'tilt: value + size · หลีกเลี่ยง RMW ติดลบ',
      'screen: P/B ต่ำ + 12m momentum บวก + ROE > 12%',
    ],
    picks: [
      { tk: 'XLE', mkt: 'US', tv: 'AMEX:XLE', entry: '94', stop: '86', target: '110', rr: '1:2.0', dot: C.green, note: 'energy · value+momentum · reflation tilt', dd: { fv: '$110', up: '+17%', wacc: '—', g: '—', rev: '+9% YoY', mgn: '—', roic: '14%', pe: '12x' } },
      { tk: 'TIDLOR', mkt: 'TH', tv: 'SET:TIDLOR', entry: '16.5', stop: '14.8', target: '20', rr: '1:2.1', dot: C.green, note: 'quality · ROE 18% · momentum บวก', dd: { fv: '฿20', up: '+21%', wacc: '9.5%', g: '4.0%', rev: '+14% YoY', mgn: '32%', roic: '18%', pe: '15x' } },
      { tk: '7203', mkt: 'JP', tv: 'TSE:7203', entry: '2,950', stop: '2,720', target: '3,500', rr: '1:2.4', dot: C.green, note: 'Toyota · P/B 1.0 · factor cheap', dd: { fv: '¥3,500', up: '+19%', wacc: '8.0%', g: '2.0%', rev: '+6% YoY', mgn: '11%', roic: '10%', pe: '9x' } },
      { tk: '601318', mkt: 'CN', tv: 'SSE:601318', entry: '48', stop: '43', target: '60', rr: '1:2.4', dot: C.green, note: 'Ping An · deep value · ประกัน', dd: { fv: '¥60', up: '+25%', wacc: '10%', g: '3.0%', rev: '+7% YoY', mgn: '—', roic: '11%', pe: '7x' } },
    ],
  },
  {
    key: 'forensic',
    name: 'Forensic Screen',
    sub: 'Beneish M-score · accruals · cash-flow quality',
    tilt: 'คัดหุ้นเสี่ยงตกแต่งงบออกก่อนเข้าพอร์ต — ใช้เป็นชั้นกรองความเสี่ยง ไม่ใช่ชั้นเลือกซื้อ',
    assumptions: [
      'ตัดออกถ้า M-score > −1.78 (เสี่ยงตกแต่งงบ)',
      'DSO / inventory โตเร็วกว่ารายได้ = ธงแดง',
      'CFO / Net income < 0.8 ติดต่อกัน = ระวัง',
    ],
    picks: [
      { tk: 'MSFT', mkt: 'US', tv: 'NASDAQ:MSFT', entry: '—', stop: '—', target: '—', rr: 'PASS', dot: C.green, note: '✓ accruals ต่ำ · cash flow คุณภาพดี · M-score −2.4', dd: { fv: 'M −2.4', up: 'PASS', wacc: '—', g: '—', rev: '+16% YoY', mgn: '45%', roic: '28%', pe: '34x' } },
      { tk: '7203', mkt: 'JP', tv: 'TSE:7203', entry: '—', stop: '—', target: '—', rr: 'PASS', dot: C.green, note: '✓ งบสะอาด · CFO/NI 1.1', dd: { fv: 'M −2.1', up: 'PASS', wacc: '—', g: '—', rev: '+6% YoY', mgn: '11%', roic: '10%', pe: '9x' } },
      { tk: 'หุ้น TH-x', mkt: 'TH', tv: '', entry: '—', stop: '—', target: '—', rr: 'FLAG', dot: C.red, note: '✗ DSO +40% · ลูกหนี้โตเร็วกว่ารายได้ — ตัดออก', dd: { fv: 'M −1.0', up: 'FLAG', wacc: '—', g: '—', rev: '+30% YoY', mgn: '12%', roic: '6%', pe: '—' } },
      { tk: 'หุ้น CN-y', mkt: 'CN', tv: '', entry: '—', stop: '—', target: '—', rr: 'FLAG', dot: C.red, note: '✗ related-party สูง · M-score −1.2 — ตัดออก', dd: { fv: 'M −1.2', up: 'FLAG', wacc: '—', g: '—', rev: '+45% YoY', mgn: '20%', roic: '5%', pe: '—' } },
    ],
  },
  {
    key: 'macro',
    name: 'Macro / Regime',
    sub: '4-box Growth×Inflation → sector tilt',
    tilt: 'ปัจจุบัน = Reflation (CPI 4.27% · INDPRO +1.67%) → น้ำหนัก Cyclicals · Energy · Commodity · Financials',
    assumptions: [
      'Reflation → Energy / Materials / Financials / Value',
      'trigger เปลี่ยน regime: CPI ทะลุ 5% หรือ yield curve invert',
      'ลดน้ำหนัก long-duration tech ถ้า yield +50bps',
    ],
    picks: [
      { tk: 'PTTEP', mkt: 'TH', tv: 'SET:PTTEP', entry: '128', stop: '116', target: '152', rr: '1:2.0', dot: C.green, note: 'energy · ได้จาก reflation · เงินปันผลสูง', dd: { fv: '฿152', up: '+19%', wacc: '9.0%', g: '2.0%', rev: '+6% YoY', mgn: '38%', roic: '15%', pe: '8x' } },
      { tk: 'XLF', mkt: 'US', tv: 'AMEX:XLF', entry: '52', stop: '48', target: '61', rr: '1:2.3', dot: C.green, note: 'financials · ชันของ curve หนุน NIM', dd: { fv: '$61', up: '+17%', wacc: '—', g: '—', rev: '+8% YoY', mgn: '—', roic: '13%', pe: '14x' } },
      { tk: '601857', mkt: 'CN', tv: 'SSE:601857', entry: '8.6', stop: '7.8', target: '10.5', rr: '1:2.4', dot: C.green, note: 'PetroChina · commodity cycle', dd: { fv: '¥10.5', up: '+22%', wacc: '10%', g: '1.5%', rev: '+4% YoY', mgn: '14%', roic: '9%', pe: '8x' } },
      { tk: '5401', mkt: 'JP', tv: 'TSE:5401', entry: '3,420', stop: '3,150', target: '4,100', rr: '1:2.5', dot: C.green, note: 'Nippon Steel · materials · value', dd: { fv: '¥4,100', up: '+20%', wacc: '8.5%', g: '1.5%', rev: '+5% YoY', mgn: '12%', roic: '9%', pe: '7x' } },
    ],
  },
  {
    key: 'options',
    name: 'Options / Hedge',
    sub: 'Buy & Hedge · CSP · Collar · CaR',
    tilt: 'ทุก single-name position ต้อง hedge — คุม delta รวม ≤ 1.0 · งบ hedge 1–3%/ปี · harvest ตามเกณฑ์',
    assumptions: [
      'delta รวม (หุ้น+hedge) ≤ 1.0',
      'harvest เมื่อกำไร ≥ 50% ของ CaR (roll)',
      'ขาย CSP เฉพาะหุ้นที่อยากถือจริง · IV rank > 50',
    ],
    picks: [
      { tk: 'NVDA', mkt: 'US', tv: 'NASDAQ:NVDA', entry: 'collar', stop: 'put 1,300', target: 'call 1,700', rr: 'CaR 8%', dot: C.purpleLt, note: 'long stock + long put + short call · zero-cost', dd: { fv: 'collar', up: 'CaR 8%', wacc: '—', g: '—', rev: 'IVr 62', mgn: 'Δ 0.85', roic: '—', pe: '45x' } },
      { tk: 'MSFT', mkt: 'US', tv: 'NASDAQ:MSFT', entry: 'CSP 440', stop: '—', target: 'prem 1.4%', rr: 'IVr 58', dot: C.purpleLt, note: 'ขาย cash-secured put · อยากถือที่ 440', dd: { fv: 'CSP', up: 'yield 1.4%/mo', wacc: '—', g: '—', rev: 'IVr 58', mgn: 'Δ −0.30', roic: '—', pe: '34x' } },
      { tk: 'AOT', mkt: 'TH', tv: 'SET:AOT', entry: 'married put', stop: 'put 57', target: '—', rr: 'CaR 8%', dot: C.purpleLt, note: 'long stock + ATM put · ป้องกันเต็ม', dd: { fv: 'married put', up: 'CaR 8%', wacc: '—', g: '—', rev: 'IVr 45', mgn: 'Δ 0.55', roic: '—', pe: '28x' } },
      { tk: 'SET50', mkt: 'TH', tv: 'SET:SET50', entry: 'port put', stop: '95% 3mo', target: '—', rr: 'hedge 2%', dot: C.purpleLt, note: 'portfolio put · beta-weighted hedge', dd: { fv: 'index put', up: 'cost 2%/yr', wacc: '—', g: '—', rev: '—', mgn: 'β-weighted', roic: '—', pe: '—' } },
    ],
  },
];
