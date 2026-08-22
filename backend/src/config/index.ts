import path from 'path';
import os from 'os';

export const PORT = process.env.PORT || 4173;
export const TIMEZONE = 'Asia/Kolkata';
export const CRON_SCHEDULE = '0 9 * * 1-5';
export const NEUTRAL_BAND_PERCENT = 0.1;
export const VIX_THRESHOLD = 15;
export const BROWSER_USER_AGENT =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36';

// Vercel's serverless filesystem is read-only except /tmp (process.env.VERCEL is set
// automatically on Vercel). Everywhere else (local dev, Render, etc.) keeps writing
// to the real project folder as before.
export const LOG_FILE = process.env.VERCEL
  ? path.join(os.tmpdir(), 'history.jsonl')
  : path.join(__dirname, '..', '..', 'data', 'history.jsonl');
