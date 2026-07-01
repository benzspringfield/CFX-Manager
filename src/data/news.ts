import type { NewsItem } from '../types';

// News Input — ตัดบทวิเคราะห์/พยากรณ์ออก เหลือข้อเท็จจริง + ระบุแหล่ง
export const NEWS: NewsItem[] = [
  { source: 'JPMorgan', badgeBg: '#3461a8', badgeColor: '#fff', meta: 'macro · verified', text: 'U.S. CPI +4.27% YoY — เร่งเหนือกรอบเป้า Fed' },
  { source: 'BofA', badgeBg: '#c0473a', badgeColor: '#fff', meta: 'Flow Show · 25มิย', text: 'Bull & Bear 9.1 — sell signal · FMS positioning 100%' },
  { source: 'BofA', badgeBg: '#c0473a', badgeColor: '#fff', meta: 'flows · weekly', text: 'Tech funds −$9.3bn — record outflow (หลัง record inflow)' },
  { source: 'SET', badgeBg: '#e8a13a', badgeColor: '#1a1306', meta: 'flow', text: 'ต่างชาติขายสุทธิ ฿2.1bn สัปดาห์นี้' },
  { source: 'investing', badgeBg: '#2596a8', badgeColor: '#fff', meta: 'rates', text: 'BoJ คงดอกเบี้ยนโยบาย 0.50%' },
  { source: 'TradingView', badgeBg: '#2962ff', badgeColor: '#fff', meta: 'technical', text: 'CSI 300 ยืนเหนือ MA200 — breakout' },
];

export const NEWS_SOURCES = 'sources · JPM · UBS · BofA · SET · settrade · investing · TradingView · FRED · CFTC · EDGAR';
