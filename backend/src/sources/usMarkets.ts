import { httpGetJson } from '../utils/httpGet';
import { classifyByPercent } from '../utils/classify';
import { FetchedSignal, UsMarketRaw } from '../types/indicator.types';

interface YahooChartResponse {
  chart?: {
    result?: Array<{
      meta?: {
        regularMarketPrice?: number;
        chartPreviousClose?: number;
      };
    }>;
  };
}

async function fetchYahooIndex(symbol: string, key: string, label: string): Promise<FetchedSignal<UsMarketRaw>> {
  const url = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(symbol)}?interval=1d&range=1d`;
  const json = await httpGetJson<YahooChartResponse>(url);
  const meta = json?.chart?.result?.[0]?.meta;
  if (!meta || typeof meta.regularMarketPrice !== 'number' || typeof meta.chartPreviousClose !== 'number') {
    throw new Error(`Unexpected Yahoo Finance response shape for ${symbol}`);
  }

  const { regularMarketPrice, chartPreviousClose } = meta;
  const percentChange = ((regularMarketPrice - chartPreviousClose) / chartPreviousClose) * 100;

  return {
    key,
    label,
    raw: {
      close: regularMarketPrice,
      previousClose: chartPreviousClose,
      percentChange
    },
    vote: classifyByPercent(percentChange)
  };
}

export const fetchNasdaq = () => fetchYahooIndex('^IXIC', 'nasdaq', 'NASDAQ');
export const fetchDow = () => fetchYahooIndex('^DJI', 'dow', 'Dow Jones');
