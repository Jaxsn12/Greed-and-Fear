import { withRetry } from '../utils/withRetry';
import { fetchNasdaq, fetchDow } from '../sources/usMarkets';
import { fetchVixAndBreadth } from '../sources/nseIndices';
import { fetchGiftNifty } from '../sources/giftNifty';
import { resolveDirection, resolveVolatility, combine, annotate } from './voteEngine.service';
import { appendRun, readHistory, readLatest } from '../store/history.store';
import { Run, Signal, VixRaw } from '../types/indicator.types';

function neutralVoteFallback(key: string, label: string, error: Error): Signal {
  return { key, label, raw: null, vote: 0, ok: false, error: error.message };
}

function unknownVolatilityFallback(key: string, label: string, error: Error): Signal {
  return { key, label, raw: null, volatility: 'UNKNOWN', ok: false, error: error.message };
}

async function safeFetch<T>(key: string, label: string, fn: () => Promise<T>): Promise<T & { ok: true; error: null }> {
  try {
    const result = await withRetry(fn, { retries: 2, label });
    return { ...result, ok: true, error: null };
  } catch (err: any) {
    console.error(`[${label}] failed after retries: ${err.message}`);
    throw err;
  }
}

// The orchestrator: fetches every signal source, scores/combines them via the vote
// engine, persists the run, and returns it. Same flow as the original runIndicator().
export async function runIndicator(): Promise<Run> {
  const [nasdaq, dow, giftNifty, vixAndBreadth] = await Promise.all([
    safeFetch('nasdaq', 'NASDAQ', fetchNasdaq).catch((err) => neutralVoteFallback('nasdaq', 'NASDAQ', err)),
    safeFetch('dow', 'Dow Jones', fetchDow).catch((err) => neutralVoteFallback('dow', 'Dow Jones', err)),
    safeFetch('giftNifty', 'GIFT Nifty', fetchGiftNifty).catch((err) => neutralVoteFallback('giftNifty', 'GIFT Nifty', err)),
    safeFetch('vixAndBreadth', 'India VIX / NSE Breadth', fetchVixAndBreadth).catch((err) => ({
      ok: false as const,
      error: err.message as string
    }))
  ]);

  // vixAndBreadth is a combined fetch (one NSE call, two signals) — unpack into
  // two independent signal entries, propagating the shared failure if it failed.
  let vix: Signal, breadth: Signal;
  if (vixAndBreadth.ok) {
    vix = { ...vixAndBreadth.vix, ok: true, error: null };
    breadth = { ...vixAndBreadth.breadth, ok: true, error: null };
  } else {
    const err = new Error(vixAndBreadth.error);
    vix = unknownVolatilityFallback('vix', 'India VIX', err);
    breadth = neutralVoteFallback('breadth', 'NSE Advances/Declines', err);
  }

  const directionSignals = [nasdaq, dow, breadth, giftNifty].map(annotate);
  const direction = resolveDirection(directionSignals);
  const volatility = resolveVolatility({ ok: vix.ok, volatility: vix.volatility, raw: vix.raw as VixRaw | null });
  const combined = combine(direction, volatility);

  const signals = [...directionSignals, annotate(vix)];

  const run: Run = {
    timestamp: new Date().toISOString(),
    direction,
    volatility,
    combined,
    signals
  };

  appendRun(run);
  return run;
}

export function getHistory(limit = 60): Run[] {
  return readHistory(limit);
}

export function getLatest(): Run | null {
  return readLatest();
}
