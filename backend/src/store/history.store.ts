import fs from 'fs';
import path from 'path';
import { LOG_FILE } from '../config';
import { Run } from '../types/indicator.types';

function ensureLogFile(): void {
  const dir = path.dirname(LOG_FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  if (!fs.existsSync(LOG_FILE)) fs.writeFileSync(LOG_FILE, '');
}

export function appendRun(run: Run): void {
  ensureLogFile();
  fs.appendFileSync(LOG_FILE, JSON.stringify(run) + '\n');
}

export function readHistory(limit = 60): Run[] {
  ensureLogFile();
  const content = fs.readFileSync(LOG_FILE, 'utf8').trim();
  if (!content) return [];
  const lines = content.split('\n').filter(Boolean);
  return lines
    .slice(-limit)
    .map((line) => JSON.parse(line) as Run)
    .reverse();
}

export function readLatest(): Run | null {
  const history = readHistory(1);
  return history[0] || null;
}
