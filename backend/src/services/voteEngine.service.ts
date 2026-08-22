import { Direction, DirectionCall, Signal, VoteLabel, Volatility, Combined, VixRaw } from '../types/indicator.types';

const VOTE_LABEL: Record<string, VoteLabel> = { '1': 'BULLISH', '-1': 'BEARISH', '0': 'NEUTRAL' };
const DIRECTION_ICON: Record<DirectionCall, string> = { BULLISH: '🟢', BEARISH: '🔴', NEUTRAL: '⚫' };
const VOLATILITY_LABEL: Record<string, string> = { VOLATILE: 'Volatile', STABLE: 'Stable' };

// Direction: majority of the 4 directional signals (NASDAQ, Dow, NSE A/D, GIFT Nifty).
// VIX is intentionally excluded here — it measures volatility, not direction.
export function resolveDirection(signals: Signal[]): Direction {
  const bullish = signals.filter((s) => s.vote === 1).length;
  const bearish = signals.filter((s) => s.vote === -1).length;
  const neutral = signals.length - bullish - bearish;

  let call: DirectionCall = 'NEUTRAL';
  if (bullish >= 3) call = 'BULLISH';
  else if (bearish >= 3) call = 'BEARISH';

  return {
    call,
    icon: DIRECTION_ICON[call],
    counts: { bullish, bearish, neutral }
  };
}

export interface VolatilityInput {
  ok: boolean;
  volatility?: string;
  raw?: VixRaw | null;
}

// Volatility: read off VIX alone, independent of direction.
export function resolveVolatility(vixSignal: VolatilityInput): Volatility {
  const state = (vixSignal.ok ? vixSignal.volatility : 'UNKNOWN') as Volatility['state'];
  return {
    state,
    label: VOLATILITY_LABEL[state] || 'Unknown',
    value: vixSignal.ok ? vixSignal.raw?.value ?? null : null
  };
}

export function combine(direction: { call: DirectionCall; icon: string }, volatility: { state: string; label: string }): Combined {
  const directionLabel = direction.call.charAt(0) + direction.call.slice(1).toLowerCase();
  if (volatility.state === 'UNKNOWN') {
    return { label: `${directionLabel}`, icon: direction.icon };
  }
  return {
    label: `${directionLabel} & ${volatility.label}`,
    icon: direction.icon
  };
}

export function annotate<T extends { vote?: number }>(signal: T): T & { voteLabel?: VoteLabel } {
  if (signal.vote !== undefined) {
    return { ...signal, voteLabel: VOTE_LABEL[String(signal.vote)] };
  }
  return signal;
}
