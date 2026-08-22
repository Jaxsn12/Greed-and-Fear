import { httpGetJson } from '../utils/httpGet';
import { classifyVolatility, classifyBreadth } from '../utils/classify';
import { VixAndBreadthResult } from '../types/indicator.types';

interface NseIndexEntry {
  indexSymbol: string;
  last?: number;
  percentChange?: number;
  advances?: string | number;
  declines?: string | number;
}

interface NseAllIndicesResponse {
  data?: NseIndexEntry[];
}

async function fetchNseAllIndices(): Promise<{ vixEntry: NseIndexEntry; niftyEntry: NseIndexEntry }> {
  const json = await httpGetJson<NseAllIndicesResponse>('https://www.nseindia.com/api/allIndices', {
    Referer: 'https://www.nseindia.com/market-data/live-market-indices'
  });
  const list = json?.data;
  if (!Array.isArray(list)) throw new Error('Unexpected NSE allIndices response shape');

  const vixEntry = list.find((d) => d.indexSymbol === 'INDIA VIX');
  const niftyEntry = list.find((d) => d.indexSymbol === 'NIFTY 50');
  if (!vixEntry || !niftyEntry) throw new Error('Missing INDIA VIX or NIFTY 50 in NSE response');

  return { vixEntry, niftyEntry };
}

export async function fetchVixAndBreadth(): Promise<VixAndBreadthResult> {
  const { vixEntry, niftyEntry } = await fetchNseAllIndices();

  const vixValue = vixEntry.last as number;
  const advances = Number(niftyEntry.advances);
  const declines = Number(niftyEntry.declines);

  return {
    vix: {
      key: 'vix',
      label: 'India VIX',
      raw: { value: vixValue, percentChange: vixEntry.percentChange as number },
      volatility: classifyVolatility(vixValue)
    },
    breadth: {
      key: 'breadth',
      label: 'NSE Advances/Declines',
      raw: { advances, declines },
      vote: classifyBreadth(advances, declines)
    }
  };
}
