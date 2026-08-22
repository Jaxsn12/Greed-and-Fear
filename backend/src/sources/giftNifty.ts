import { httpGetJson } from '../utils/httpGet';
import { classifyByPercent } from '../utils/classify';
import { FetchedSignal, GiftNiftyRaw } from '../types/indicator.types';

interface GiftNiftyResponse {
  success?: boolean;
  lastPrice?: number;
  close?: number;
  changePercent?: number;
}

// NOTE: free-dashboard source, pending client decision on whether to switch
// to an official broker API (e.g. Zerodha Kite Connect) for GIFT Nifty.
export async function fetchGiftNifty(): Promise<FetchedSignal<GiftNiftyRaw>> {
  const json = await httpGetJson<GiftNiftyResponse>('https://live.giftcitynifty.com/api/gift-nifty');
  if (!json || json.success !== true || typeof json.changePercent !== 'number') {
    throw new Error('Unexpected GIFT Nifty response shape');
  }

  return {
    key: 'giftNifty',
    label: 'GIFT Nifty',
    raw: {
      lastPrice: json.lastPrice as number,
      close: json.close as number,
      percentChange: json.changePercent
    },
    vote: classifyByPercent(json.changePercent)
  };
}
