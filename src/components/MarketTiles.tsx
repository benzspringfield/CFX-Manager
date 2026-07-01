import { useEffect, useRef } from 'react';
import { C, F } from '../theme';
import { injectWidget, TV_ADV, miniConfig } from '../lib/tradingview';

const TILES = [
  { name: 'US · S&P 500', ytd: '+8.4% YTD', up: true, sym: 'SP:SPX' },
  { name: 'CN · CSI 300', ytd: '+11.6% YTD', up: true, sym: 'SSE:000300' },
  { name: 'JP · Nikkei 225', ytd: '+5.3% YTD', up: true, sym: 'TVC:NI225' },
  { name: 'TH · SET', ytd: '−2.1% YTD', up: false, sym: 'SET:SET' },
];

function Tile({ name, ytd, up, sym }: (typeof TILES)[number]) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const t = setTimeout(() => injectWidget(ref.current, TV_ADV, miniConfig(sym)), 60);
    return () => clearTimeout(t);
  }, [sym]);
  return (
    <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 15, padding: '15px 16px 10px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontFamily: F.brand, fontWeight: 700, fontSize: 12.5, color: C.text }}>{name}</span>
        <span style={{ fontFamily: F.mono, fontSize: 11, color: up ? C.green : C.red }}>{ytd}</span>
      </div>
      <div ref={ref} style={{ height: 190, marginTop: 8, borderRadius: 10, overflow: 'hidden' }} />
    </div>
  );
}

export default function MarketTiles() {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 13, marginBottom: 13 }}>
      {TILES.map((t) => (
        <Tile key={t.sym} {...t} />
      ))}
    </div>
  );
}
