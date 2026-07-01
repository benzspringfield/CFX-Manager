// MERIDIAN design tokens — ค่าจริงจาก design handoff (hifi)
export const C = {
  bg: '#0b0d12',
  card: '#14171e',
  cardInset: '#1b1f27',
  cardInset2: '#181c24',
  chip: '#23262f',
  drawer: '#101319',
  border: 'rgba(255,255,255,0.07)',
  borderSoft: 'rgba(255,255,255,0.06)',

  text: '#e8eaed',
  head: '#f0f1f4',
  head2: '#f4f5f7',
  sub: '#9a9da6',
  faint: '#6b6e78',
  faint2: '#71747e',
  faint3: '#54565e',

  purple: '#7c6cf0',
  purpleLt: '#a98cff',
  purpleText: '#c3b8fa',

  green: '#4ec98a',
  red: '#e0594e',
  gold: '#d2a64a',
  goldLt: '#e0bd6f',
  bond: '#7c6cf0',
} as const;

export const F = {
  brand: "'Plus Jakarta Sans', sans-serif",
  mono: "'IBM Plex Mono', monospace",
  thai: "'IBM Plex Sans Thai', sans-serif",
} as const;

export const radialBg =
  'radial-gradient(1200px 600px at 80% -10%, rgba(124,108,240,0.10), transparent 60%), #0b0d12';
