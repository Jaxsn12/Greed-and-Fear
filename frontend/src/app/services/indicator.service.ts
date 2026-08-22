import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Run } from '../models/run.model';

// Same three endpoints app.js called: GET /api/latest, GET /api/history, POST /api/run-now.
@Injectable({
  providedIn: 'root'
})
export class IndicatorService {
  private readonly base = environment.apiBase;

  constructor(private http: HttpClient) {}

  getLatest(): Observable<Run | null> {
    return this.http.get<Run | null>(`${this.base}/api/latest`);
  }

  getHistory(limit = 30): Observable<Run[]> {
    return this.http.get<Run[]>(`${this.base}/api/history`, { params: { limit: String(limit) } });
  }

  runNow(): Observable<Run> {
    return this.http.post<Run>(`${this.base}/api/run-now`, {});
  }
}
