// TradingView embed helper — inject <script> widget ลง container element
// (กราฟ/ticker สดอยู่แล้ว ไม่ต้องผ่าน proxy)

export function injectWidget(el: HTMLElement | null, src: string, config: Record<string, unknown>) {
  if (!el) return;
  el.innerHTML = '';
  const wrap = document.createElement('div');
  wrap.className = 'tradingview-widget-container';
  wrap.style.height = '100%';
  const inner = document.createElement('div');
  inner.className = 'tradingview-widget-container__widget';
  inner.style.height = '100%';
  wrap.appendChild(inner);
  const s = document.createElement('script');
  s.src = src;
  s.async = true;
  s.type = 'text/javascript';
  s.innerHTML = JSON.stringify(config);
  wrap.appendChild(s);
  el.appendChild(wrap);
}

export const TV_TAPE = 'https://s3.tradingview.com/external-embedding/embed-widget-ticker-tape.js';
export const TV_ADV = 'https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js';

export const TAPE_SYMBOLS = [
  { proName: 'SP:SPX', title: 'S&P 500' },
  { proName: 'SSE:000300', title: 'CSI 300' },
  { proName: 'TVC:NI225', title: 'Nikkei 225' },
  { proName: 'SET:SET', title: 'SET' },
  { proName: 'TVC:GOLD', title: 'Gold' },
  { proName: 'TVC:US10Y', title: 'US 10Y' },
];

export function miniConfig(symbol: string) {
  return {
    symbol,
    interval: 'D',
    theme: 'dark',
    style: '3',
    locale: 'en',
    autosize: true,
    hide_top_toolbar: true,
    hide_side_toolbar: true,
    hide_legend: true,
    allow_symbol_change: false,
    save_image: false,
    withdateranges: false,
    details: false,
    calendar: false,
    backgroundColor: 'rgba(20,23,30,1)',
    gridColor: 'rgba(255,255,255,0.04)',
  };
}

export function drawerConfig(symbol: string) {
  return {
    symbol,
    interval: 'D',
    theme: 'dark',
    style: '1',
    locale: 'en',
    autosize: true,
    hide_top_toolbar: false,
    hide_legend: false,
    allow_symbol_change: false,
    save_image: false,
    withdateranges: true,
  };
}

// ป้องกัน error จาก TradingView 3rd-party script ไม่ให้ crash app
export function installTvErrorGuard() {
  const w = window as unknown as { __meridianErrGuard?: boolean };
  if (w.__meridianErrGuard) return;
  w.__meridianErrGuard = true;
  const isTv = (src: unknown) => typeof src === 'string' && /tradingview/i.test(src);
  window.addEventListener('error', (e) => {
    if (!e.filename || isTv(e.filename) || (!e.message && !e.error)) {
      e.stopImmediatePropagation();
      e.preventDefault();
      return true;
    }
  }, true);
  window.addEventListener('unhandledrejection', (e) => {
    const r = e?.reason as { stack?: string } | undefined;
    if (!r || isTv(r?.stack)) e.preventDefault();
  });
}
