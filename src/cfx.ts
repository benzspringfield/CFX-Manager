// CFX Manager — data types (source of truth = public/data/daily/latest.json)
export interface Consensus {
  src?: string; cur?: string; rating?: string; recom?: number;
  n?: number; b?: number | null; h?: number; s?: number;
  tgt?: number; hi?: number; lo?: number; bull?: number | null;
  note?: string; linkOnly?: boolean;
}
export interface Amorn { business?: string; growth?: string; valuation?: string; financials?: string }
export interface CutTrigger { t: string; triggered?: boolean }
export interface Strategy { bias?: string; entry?: string; stop?: string; target?: string; rr?: string; note?: string }
export interface Horizons { short?: string; medium?: string; long?: string }
export interface Research { label?: string; url?: string }

export interface CfxPick {
  rank?: number; tier?: string; tk: string; name: string; mkt: string;
  tv?: string; access?: string; level?: string; why?: string;
  pillars?: string[]; amorn?: Amorn; jrt?: string[];
  watchpoints?: string[]; cutTriggers?: CutTrigger[];
  strategy?: Strategy; horizons?: Horizons; research?: Research;
}
export interface Bucket { key: string; label: string; access?: string; picks: CfxPick[] }

export interface FullAnalysis {
  title?: string; asof?: string;
  regime?: { name?: string; tilt?: string; box?: string[] };
  bullBear?: { value: number; trajectory: [string, number][]; note?: string };
  tripwires?: { label: string; level: string; meaning: string }[];
  flows?: string[];
  analog?: { text?: string; caveat?: string };
  stance?: { before?: string; at?: string; structural?: string };
  sections?: { h: string; body: string }[];
  sources?: string[];
}
export interface BriefTopic { text: string; source?: string; time?: string; type?: string; url?: string }
export interface MarketBrief {
  label: string; headline: string; topics: BriefTopic[]; full: FullAnalysis;
}
export interface Daily {
  date: string; regime: string; bullBear: number;
  regimeTilt?: string; briefAsof?: string; briefNote?: string;
  briefs: Record<string, MarketBrief>;
  tierLegend?: string;
  buckets: Bucket[];
  consensus?: Record<string, Consensus>; consensusAsof?: string;
  macro?: Record<string, string>; provenance?: string;
}
