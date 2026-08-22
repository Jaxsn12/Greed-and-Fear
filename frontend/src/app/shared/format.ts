import { ICONS } from './icons';
import { Signal, Vote } from '../models/run.model';

// Ported verbatim from public/app.js — same lookup tables, same logic.

export const DIRECTION_TEXT: Record<string, string> = { BULLISH: 'Bullish', BEARISH: 'Bearish', NEUTRAL: 'Neutral' };
export const DIRECTION_CLASS: Record<string, string> = { BULLISH: 'bullish', BEARISH: 'bearish', NEUTRAL: 'neutral' };
export const VOLATILITY_CLASS: Record<string, string> = { VOLATILE: 'volatile', STABLE: 'stable', UNKNOWN: 'unknown' };
export const VOLATILITY_TEXT: Record<string, string> = { VOLATILE: 'Volatile', STABLE: 'Stable', UNKNOWN: 'Unknown' };

export function formatTime(iso: string): string {
  return new Date(iso).toLocaleString('en-IN', {
    timeZone: 'Asia/Kolkata',
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit'
  });
}

export function formatPercent(pct: number | undefined | null): string {
  if (typeof pct !== 'number') return '—';
  const sign = pct > 0 ? '+' : '';
  return `${sign}${pct.toFixed(2)}%`;
}

export function voteClass(vote: Vote | undefined): string {
  return vote === 1 ? 'bullish' : vote === -1 ? 'bearish' : 'neutral';
}

export function voteIconSvg(vote: Vote | undefined): string {
  return vote === 1 ? ICONS.trendUp : vote === -1 ? ICONS.trendDown : ICONS.dash;
}

export interface TileSpec {
  label: string;
  iconClass: string;
  icon: string;
  value: string;
  valueClass: string;
  sub: string;
  error?: boolean;
}

export function tileSpec(signal: Signal): TileSpec {
  const base = { label: signal.label };
  if (!signal.ok) {
    return { ...base, iconClass: 'neutral', icon: ICONS.dash, value: 'No data', valueClass: 'neutral', sub: signal.error || 'fetch failed', error: true };
  }

  switch (signal.key) {
    case 'nasdaq':
    case 'dow':
    case 'giftNifty': {
      const cls = voteClass(signal.vote);
      return {
        ...base,
        iconClass: cls,
        icon: voteIconSvg(signal.vote),
        value: formatPercent(signal.raw?.percentChange),
        valueClass: cls,
        sub: signal.raw?.close != null ? `Close ${signal.raw.close.toLocaleString('en-IN')}` : ''
      };
    }
    case 'breadth':
      return {
        ...base,
        iconClass: 'amber',
        icon: ICONS.barChart,
        value: `${signal.raw?.advances} / ${signal.raw?.declines}`,
        valueClass: 'neutral',
        sub: 'Advances / Declines'
      };
    case 'vix':
      return {
        ...base,
        iconClass: 'purple',
        icon: ICONS.activity,
        value: (signal.raw?.value ?? 0).toFixed(2),
        valueClass: 'purple',
        sub: `${formatPercent(signal.raw?.percentChange)} vs prev close`
      };
    default:
      return { ...base, iconClass: 'neutral', icon: ICONS.dash, value: '—', valueClass: 'neutral', sub: '' };
  }
}
