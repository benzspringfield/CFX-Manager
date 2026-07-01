export interface DrillDown {
  fv: string;
  up: string;
  wacc: string;
  g: string;
  rev: string;
  mgn: string;
  roic: string;
  pe: string;
}

export interface Pick {
  tk: string;
  mkt: 'US' | 'CN' | 'TH' | 'JP';
  tv: string;
  entry: string;
  stop: string;
  target: string;
  rr: string;
  dot: string;
  note: string;
  dd: DrillDown;
}

export interface Framework {
  key: string;
  name: string;
  sub: string;
  tilt: string;
  assumptions: string[];
  picks: Pick[];
}

export interface NewsItem {
  source: string;
  badgeBg: string;
  badgeColor: string;
  meta: string;
  text: string;
}

export interface ReportBox {
  n: string;
  t: string;
  v: string;
}

export interface Tripwire {
  label: string;
  level: string;
  tv: string;
  meaning: string;
}

export interface BBPoint {
  label: string;
  v: number;
}

export type LiveState = 'idle' | 'connecting' | 'ok' | 'error';
export type View = 'dashboard' | 'report';
