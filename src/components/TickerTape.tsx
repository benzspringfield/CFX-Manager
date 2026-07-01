import { useEffect, useRef } from 'react';
import { injectWidget, TV_TAPE, TAPE_SYMBOLS } from '../lib/tradingview';

export default function TickerTape() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const t = setTimeout(() => {
      injectWidget(ref.current, TV_TAPE, {
        symbols: TAPE_SYMBOLS,
        showSymbolLogo: true,
        isTransparent: true,
        displayMode: 'compact',
        colorTheme: 'dark',
        locale: 'en',
      });
    }, 60);
    return () => clearTimeout(t);
  }, []);
  return <div ref={ref} style={{ borderTop: '1px solid rgba(255,255,255,0.05)', minHeight: 46 }} />;
}
