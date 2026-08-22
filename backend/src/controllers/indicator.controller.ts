import { Request, Response } from 'express';
import * as indicatorService from '../services/indicator.service';

// Thin layer: parse/validate the request, call the service, shape the response.
// Same behavior as the old inline route handlers in server.js — just relocated.

export function getLatest(req: Request, res: Response): void {
  res.json(indicatorService.getLatest());
}

export function getHistory(req: Request, res: Response): void {
  const limit = Number(req.query.limit) || 60;
  res.json(indicatorService.getHistory(limit));
}

export async function runNow(req: Request, res: Response): Promise<void> {
  try {
    const run = await indicatorService.runIndicator();
    res.json(run);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
}
