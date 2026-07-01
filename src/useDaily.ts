import { useEffect, useState } from 'react';
import type { Daily } from './cfx';

// โหลด source of truth (engine เขียนไฟล์นี้) + overlay live consensus/macro ถ้ามี
export function useDaily(dateFile = 'latest') {
  const [daily, setDaily] = useState<Daily | null>(null);
  const [err, setErr] = useState<string>('');

  useEffect(() => {
    let alive = true;
    const base = import.meta.env.BASE_URL || '/';
    fetch(`${base}data/daily/${dateFile}.json`)
      .then((r) => { if (!r.ok) throw new Error('HTTP ' + r.status); return r.json(); })
      .then(async (d: Daily) => {
        // overlay live data ที่ engine เขียนแยก (ถ้ามี) → engine อัปเดตได้โดยไม่แตะไฟล์หลัก
        try {
          const c = await fetch(`${base}data/live/consensus.json`);
          if (c.ok) d.consensus = { ...(d.consensus || {}), ...(await c.json()) };
        } catch { /* ignore */ }
        try {
          const m = await fetch(`${base}data/live/macro.json`);
          if (m.ok) d.macro = await m.json();
        } catch { /* ignore */ }
        if (alive) setDaily(d);
      })
      .catch((e) => alive && setErr(String(e)));
    return () => { alive = false; };
  }, [dateFile]);

  return { daily, err };
}
