import { useEffect, useState } from 'react';
import { C, F, radialBg } from './theme';
import { installTvErrorGuard, injectWidget, TV_TAPE, TAPE_SYMBOLS } from './lib/tradingview';
import { useDaily } from './useDaily';
import { tierColor, tierBg, dotColor, hasRedFlag } from './lib/cfxReport';
import type { CfxPick } from './cfx';
import CfxStockModal from './components/CfxStockModal';
import CfxFullModal from './components/CfxFullModal';
import CfxStockScope from './components/CfxStockScope';

function useThaiClock() {
  const [s, setS] = useState<{ d: string; t: string }>({ d: '', t: '' });
  useEffect(() => {
    const tick = () => {
      try {
        const now = new Date();
        const d = new Intl.DateTimeFormat('th-TH', { timeZone: 'Asia/Bangkok', weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }).format(now);
        const t = new Intl.DateTimeFormat('th-TH', { timeZone: 'Asia/Bangkok', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false }).format(now);
        setS({ d, t });
      } catch { /* noop */ }
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);
  return s;
}

export default function App() {
  const { daily, err } = useDaily();
  const [bucket, setBucket] = useState('us');
  const [sel, setSel] = useState<CfxPick | null>(null);
  const [fullOpen, setFullOpen] = useState(false);
  const [briefTab, setBriefTab] = useState('us');
  const clock = useThaiClock();

  useEffect(() => { installTvErrorGuard(); }, []);
  useEffect(() => {
    const t = setTimeout(() => {
      const el = document.getElementById('tv-tape');
      if (el) injectWidget(el, TV_TAPE, { symbols: TAPE_SYMBOLS, showSymbolLogo: true, isTransparent: true, displayMode: 'compact', colorTheme: 'dark', locale: 'en' });
    }, 80);
    return () => clearTimeout(t);
  }, [daily]);

  if (err) return <div style={{ padding: 40, color: C.red, fontFamily: F.thai }}>โหลดข้อมูลไม่สำเร็จ: {err} — ตรวจว่ามีไฟล์ public/data/daily/latest.json</div>;
  if (!daily) return <div style={{ padding: 40, color: C.sub, fontFamily: F.thai }}>กำลังโหลด…</div>;

  const b = daily.buckets.find((x) => x.key === bucket) || daily.buckets[0];
  const bbZone = daily.bullBear >= 8 ? 'SELL' : daily.bullBear <= 2 ? 'BUY' : 'neutral';
  const mb = daily.briefs[briefTab] || Object.values(daily.briefs)[0];

  return (
    <div style={{ minHeight: '100vh', background: radialBg, fontFamily: F.thai, color: C.text }}>
      {/* TOP BAR */}
      <div style={{ position: 'sticky', top: 0, zIndex: 20, background: 'rgba(11,13,18,.82)', backdropFilter: 'blur(14px)', borderBottom: `1px solid ${C.border}` }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', alignItems: 'center', gap: 16, padding: '13px 26px', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ height: 32, width: 32, borderRadius: 10, background: 'linear-gradient(135deg,#7c6cf0,#a98cff)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontFamily: F.brand, fontWeight: 800, fontSize: 17 }}>C</div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontFamily: F.brand, fontWeight: 800, fontSize: 15, letterSpacing: '.13em', color: C.head }}>CFX MANAGER</span>
              <span style={{ fontSize: 10, color: C.faint2 }}>Charles Francis Xavier · JRT + Hartnett + Amorn</span>
            </div>
          </div>
          <div style={{ marginLeft: 'auto', fontFamily: F.mono, fontSize: 12.5, textAlign: 'right', lineHeight: 1.4 }}>
            <span style={{ color: C.head }}>{clock.d}</span><br />
            <span style={{ fontSize: 15, color: C.green }}>{clock.t} น.</span> <span style={{ color: C.faint3 }}>ICT</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 7, background: 'rgba(210,166,74,.12)', border: '1px solid rgba(210,166,74,.35)', borderRadius: 20, padding: '6px 13px' }}>
            <span style={{ height: 7, width: 7, borderRadius: '50%', background: C.gold }} />
            <span style={{ fontFamily: F.brand, fontWeight: 700, fontSize: 12, color: C.goldLt, letterSpacing: '.04em' }}>{daily.regime.toUpperCase()}</span>
          </div>
        </div>
        <div id="tv-tape" style={{ borderTop: '1px solid rgba(255,255,255,.05)', minHeight: 46 }} />
      </div>

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '22px 26px 80px' }}>
        {/* BRIEF */}
        <div className="card" style={{ marginBottom: 18 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginBottom: 8, flexWrap: 'wrap' }}>
            <span style={{ fontFamily: F.brand, fontWeight: 700, fontSize: 16, color: C.head }}>บรีฟวันนี้</span>
            <span style={{ fontSize: 11, color: C.faint2 }}>· The Flow Show — Hartnett lens</span>
            <span style={{ fontFamily: F.mono, fontSize: 10, color: '#8a8d96' }}>· อัปเดต {daily.briefAsof}</span>
            <span style={{ marginLeft: 'auto', fontFamily: F.mono, fontSize: 10, color: C.red, background: 'rgba(224,89,78,.12)', borderRadius: 5, padding: '3px 8px' }}>Bull&amp;Bear {daily.bullBear} · {bbZone}</span>
          </div>
          <div style={{ display: 'flex', gap: 7, flexWrap: 'wrap', marginBottom: 11 }}>
            {Object.keys(daily.briefs).map((k) => {
              const on = k === briefTab;
              return <button key={k} onClick={() => setBriefTab(k)} style={{ cursor: 'pointer', fontSize: 12, fontWeight: 600, padding: '6px 13px', borderRadius: 9, border: `1px solid ${on ? 'rgba(124,108,240,.55)' : 'rgba(255,255,255,.12)'}`, background: on ? 'rgba(124,108,240,.18)' : 'transparent', color: on ? C.purpleText : C.sub }}>{daily.briefs[k].label}</button>;
            })}
          </div>
          <div style={{ fontSize: 13.5, color: C.text, fontWeight: 600, marginBottom: 12 }}>{mb.headline}</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 9, marginBottom: 14 }}>
            {mb.topics.map((t, i) => {
              const tc = t.type === 'fact' ? C.green : C.goldLt;
              return (
                <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', borderLeft: `2px solid ${tc}`, paddingLeft: 11 }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 12, color: '#cfd1d6', lineHeight: 1.5 }}>{t.text}</div>
                    <div style={{ fontFamily: F.mono, fontSize: 9, color: C.faint, marginTop: 3 }}>
                      {t.url ? <a href={t.url} target="_blank" rel="noreferrer" style={{ color: '#7e88a8' }}>{t.source}</a> : t.source} · {t.time} · <span style={{ color: tc, fontWeight: 600 }}>{t.type === 'fact' ? 'ข้อเท็จจริง' : 'มุมมอง'}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
            <button onClick={() => setFullOpen(true)} style={{ cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 7, background: 'rgba(124,108,240,.16)', border: '1px solid rgba(124,108,240,.45)', borderRadius: 10, padding: '9px 16px', color: C.purpleText, fontSize: 12.5, fontWeight: 600 }}>📖 อ่านบทวิเคราะห์ฉบับเต็ม ({mb.label})</button>
            <span style={{ fontFamily: F.mono, fontSize: 9.5, color: C.faint3 }}>{daily.briefNote}</span>
          </div>
        </div>

        {/* STOCK ANALYSIS (ใส่ ticker เอง) */}
        <CfxStockScope />

        {/* PICKS */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginBottom: 13, flexWrap: 'wrap' }}>
          <span style={{ fontFamily: F.brand, fontWeight: 700, fontSize: 16, color: C.head }}>หุ้นน่าสนใจวันนี้</span>
          <span style={{ fontSize: 11, color: C.faint2 }}>· กดเพื่อดูบทวิเคราะห์ Amorn + เสา JRT + consensus + จุดเสี่ยง + ธงแดง</span>
        </div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 16 }}>
          {daily.buckets.map((bk) => {
            const on = bk.key === bucket;
            return <button key={bk.key} onClick={() => setBucket(bk.key)} style={{ cursor: 'pointer', fontSize: 13, fontWeight: 600, padding: '9px 18px', borderRadius: 11, border: `1px solid ${on ? 'rgba(124,108,240,.55)' : 'rgba(255,255,255,.12)'}`, background: on ? 'rgba(124,108,240,.18)' : 'transparent', color: on ? C.purpleText : C.sub }}>{bk.label}</button>;
          })}
        </div>
        <div style={{ fontFamily: F.mono, fontSize: 10, color: C.faint, marginBottom: 12 }}>วิธีซื้อ: {b.access} &nbsp;·&nbsp; <span style={{ color: '#8a8d96' }}>{daily.tierLegend}</span></div>
        <div className="picks" style={{ display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', gap: 11 }}>
          {b.picks.map((p, i) => {
            const red = hasRedFlag(p);
            return (
              <div key={i} className="pick" onClick={() => setSel(p)}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
                  <span style={{ fontFamily: F.mono, fontSize: 9, fontWeight: 600, color: tierColor(p.tier), background: tierBg(p.tier), border: `1px solid ${tierColor(p.tier)}55`, padding: '1px 6px', borderRadius: 5 }}>#{p.rank} · {p.tier}</span>
                  <span style={{ height: 7, width: 7, borderRadius: '50%', background: dotColor(p.strategy?.bias) }} />
                  <span style={{ fontFamily: F.mono, fontWeight: 600, fontSize: 13.5, color: C.head2 }}>{p.tk}</span>
                  {red
                    ? <span style={{ marginLeft: 'auto', fontSize: 9, color: '#fff', background: C.red, padding: '2px 6px', borderRadius: 5 }}>🚩</span>
                    : <span style={{ marginLeft: 'auto', fontFamily: F.mono, fontSize: 9, color: C.sub, background: C.chip, padding: '2px 6px', borderRadius: 5 }}>{p.mkt}</span>}
                </div>
                <div style={{ fontSize: 10.5, color: C.sub, marginBottom: 7, minHeight: 26 }}>{p.name}</div>
                <div style={{ fontSize: 10.5, color: '#b6b8c0', lineHeight: 1.4, marginBottom: 8, minHeight: 44 }}>{p.why}</div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: 9.5, color: '#8a8d96' }}>{p.strategy?.bias}</span>
                  <span style={{ fontFamily: F.mono, fontSize: 9.5, color: C.purpleLt }}>R:R {p.strategy?.rr || '—'}</span>
                </div>
              </div>
            );
          })}
        </div>

        <div style={{ marginTop: 22, textAlign: 'center', fontFamily: F.mono, fontSize: 10, color: '#3f4148' }}>
          CFX Manager · JRT (Damodaran/Ilmanen/Schilit/Montier/Taleb) + Hartnett + Amorn · consensus: Settrade/Finviz · decision-support ไม่ใช่คำแนะนำซื้อขาย
        </div>
      </div>

      {sel && <CfxStockModal pick={sel} daily={daily} onClose={() => setSel(null)} />}
      {fullOpen && <CfxFullModal full={mb.full} onClose={() => setFullOpen(false)} />}
    </div>
  );
}
