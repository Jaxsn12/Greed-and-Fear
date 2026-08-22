import path from 'path';

export const PORT = process.env.PORT || 4173;
export const TIMEZONE = 'Asia/Kolkata';
export const CRON_SCHEDULE = '0 9 * * 1-5';
export const NEUTRAL_BAND_PERCENT = 0.1;
export const VIX_THRESHOLD = 15;
export const BROWSER_USER_AGENT =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36';
export const LOG_FILE = path.join(__dirname, '..', '..', 'data', 'history.jsonl');
