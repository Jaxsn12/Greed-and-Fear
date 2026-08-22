import { NEUTRAL_BAND_PERCENT, VIX_THRESHOLD } from '../config';
import { Vote, VolatilityState } from '../types/indicator.types';

export function classifyByPercent(percentChange: number): Vote {
  if (Math.abs(percentChange) <= NEUTRAL_BAND_PERCENT) return 0;
  return percentChange > 0 ? 1 : -1;
}

export function classifyVolatility(value: number): VolatilityState {
  return value > VIX_THRESHOLD ? 'VOLATILE' : 'STABLE';
}

export function classifyBreadth(advances: number, declines: number): Vote {
  if (advances === declines) return 0;
  return advances > declines ? 1 : -1;
}
