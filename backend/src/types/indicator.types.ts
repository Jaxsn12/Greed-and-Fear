// Shapes exactly mirror what the original JS produced (see voteEngine.js / runIndicator.js) —
// only added here as types, no behavior encoded.

export type Vote = 1 | 0 | -1;
export type VoteLabel = 'BULLISH' | 'BEARISH' | 'NEUTRAL';
export type VolatilityState = 'VOLATILE' | 'STABLE' | 'UNKNOWN';
export type DirectionCall = 'BULLISH' | 'BEARISH' | 'NEUTRAL';

export interface UsMarketRaw {
  close: number;
  previousClose: number;
  percentChange: number;
}

export interface BreadthRaw {
  advances: number;
  declines: number;
}

export interface VixRaw {
  value: number;
  percentChange: number;
}

export interface GiftNiftyRaw {
  lastPrice: number;
  close: number;
  percentChange: number;
}

export type SignalRaw = UsMarketRaw | BreadthRaw | VixRaw | GiftNiftyRaw | null;

export interface Signal {
  key: string;
  label: string;
  raw: SignalRaw;
  vote?: Vote;
  voteLabel?: VoteLabel;
  volatility?: VolatilityState;
  ok: boolean;
  error: string | null;
}

export interface Direction {
  call: DirectionCall;
  icon: string;
  counts: { bullish: number; bearish: number; neutral: number };
}

export interface Volatility {
  state: VolatilityState;
  label: string;
  value: number | null;
}

export interface Combined {
  label: string;
  icon: string;
}

export interface Run {
  timestamp: string;
  direction: Direction;
  volatility: Volatility;
  combined: Combined;
  signals: Signal[];
}

// Fetch-layer result shapes (sources/*), before they're merged into a Run's `signals`.
export interface FetchedSignal<TRaw> {
  key: string;
  label: string;
  raw: TRaw;
  vote?: Vote;
  volatility?: VolatilityState;
}

export interface VixAndBreadthResult {
  vix: FetchedSignal<VixRaw>;
  breadth: FetchedSignal<BreadthRaw>;
}
