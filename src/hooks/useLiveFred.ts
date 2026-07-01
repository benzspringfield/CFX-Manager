import { useState, useCallback } from 'react';
import type { LiveState } from '../types';

const LS_KEY = 'meridian_proxy';

function getProxyBase(): string {
  // env override (VITE_PROXY_BASE) → localStorage → ''
  const env = (import.meta.env.VITE_PROXY_BASE || '').replace(/\/+$/, '');
  if (env) return env;
  try {
    return (localStorage.getItem(LS_KEY) || '').replace(/\/+$/, '');
  } catch {
    return '';
  }
}

export interface LiveFred {
  dgs10: string;
  live: LiveState;
  liveMsg: string;
  connect: () => Promise<void>;
  setProxy: () => void;
}

export function useLiveFred(initialDgs10: string): LiveFred {
  const [dgs10, setDgs10] = useState(initialDgs10);
  const [live, setLive] = useState<LiveState>('idle');
  const [liveMsg, setLiveMsg] = useState('');

  const connect = useCallback(async () => {
    setLive((cur) => (cur === 'connecting' ? cur : 'connecting'));
    const base = getProxyBase();
    setLiveMsg(base ? 'กำลังเชื่อมต่อผ่าน proxy: ' + base : 'กำลังลองเรียก FRED โดยตรง…');
    const url = base
      ? base + '/fred?id=DGS10&cosd=2026-06-01'
      : 'https://fred.stlouisfed.org/graph/fredgraph.csv?id=DGS10&cosd=2026-06-01';
    try {
      const res = await fetch(url);
      const text = await res.text();
      const rows = text.trim().split('\n').filter((r) => r && !/observation/i.test(r) && !r.endsWith(',.'));
      const last = rows[rows.length - 1].split(',');
      const val = parseFloat(last[1]);
      if (isNaN(val)) throw new Error('parse');
      setDgs10(val.toFixed(2));
      setLive('ok');
      setLiveMsg('เชื่อมต่อสำเร็จ · DGS10 = ' + val.toFixed(2) + ' อัปเดตสด ✓ ' + (base ? '(ผ่าน proxy)' : '(direct)'));
    } catch {
      setLive('error');
      setLiveMsg(
        base
          ? 'proxy เรียกไม่สำเร็จ — ตรวจ URL/สถานะที่ ' + base + ' (ดู proxy/README.md)'
          : 'เรียก FRED ตรงไม่ได้ (CORS) — กด ⚙ ตั้ง URL proxy ที่ deploy แล้ว (ดูโฟลเดอร์ proxy/) แล้วลองใหม่',
      );
    }
  }, []);

  const setProxy = useCallback(() => {
    let cur = '';
    try {
      cur = localStorage.getItem(LS_KEY) || '';
    } catch {
      /* noop */
    }
    const v = window.prompt(
      'วาง URL ของ proxy ที่ deploy แล้ว (เช่น https://meridian-proxy.xxx.workers.dev หรือ http://localhost:8787) — เว้นว่างเพื่อล้าง',
      cur,
    );
    if (v === null) return;
    const clean = v.trim().replace(/\/+$/, '');
    try {
      localStorage.setItem(LS_KEY, clean);
    } catch {
      /* noop */
    }
    setLive('idle');
    setLiveMsg(clean ? 'ตั้ง proxy แล้ว: ' + clean + ' — กด "เชื่อมต่อ FRED สด" อีกครั้ง' : 'ล้าง proxy แล้ว (จะลองเรียก FRED ตรง)');
  }, []);

  return { dgs10, live, liveMsg, connect, setProxy };
}
