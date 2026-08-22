export type Vote = 1 | 0 | -1;
export type DirectionCall = 'BULLISH' | 'BEARISH' | 'NEUTRAL';
export type VolatilityState = 'VOLATILE' | 'STABLE' | 'UNKNOWN';
export type SignalKey = 'nasdaq' | 'dow' | 'giftNifty' | 'breadth' | 'vix';

export interface SignalRaw {
  close?: number;
  percentChange?: number;
  advances?: number;
  declines?: number;
  value?: number;
}

export interface Signal {
  key: SignalKey;
  label: string;
  raw: SignalRaw | null;
  vote?: Vote;
  voteLabel?: 'BULLISH' | 'BEARISH' | 'NEUTRAL';
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
