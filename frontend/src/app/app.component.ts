import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { forkJoin } from 'rxjs';
import { IndicatorService } from './services/indicator.service';
import { ThemeService } from './services/theme.service';
import { Run } from './models/run.model';
import { formatTime } from './shared/format';
import { ICONS } from './shared/icons';

// Ported verbatim from public/app.js: refreshAll()/loadLatest()/loadHistory()/refresh-button handler.
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  // undefined = not yet loaded ("Loading…"), null = loaded but no runs yet, Run = loaded.
  run: Run | null | undefined = undefined;
  history: Run[] = [];
  refreshing = false;

  constructor(
    private indicator: IndicatorService,
    private theme: ThemeService,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    this.refreshAll();
  }

  get themeIcon(): SafeHtml {
    const svg = this.theme.current === 'dark' ? ICONS.sun : ICONS.moon;
    return this.sanitizer.bypassSecurityTrustHtml(svg);
  }

  get lastRunText(): SafeHtml {
    if (this.run === undefined) return this.sanitizer.bypassSecurityTrustHtml('Loading…');
    if (this.run === null) return this.sanitizer.bypassSecurityTrustHtml('No runs yet');
    return this.sanitizer.bypassSecurityTrustHtml(`Last run: <b>${formatTime(this.run.timestamp)} IST</b>`);
  }

  toggleTheme(): void {
    this.theme.toggle();
  }

  refreshAll(): void {
    forkJoin({
      latest: this.indicator.getLatest(),
      history: this.indicator.getHistory(30)
    }).subscribe(({ latest, history }) => {
      this.run = latest;
      this.history = history;
    });
  }

  onRefreshClick(): void {
    if (this.refreshing) return;
    this.refreshing = true;
    this.indicator.runNow().subscribe({
      next: () => {
        this.refreshAll();
        this.refreshing = false;
      },
      error: () => {
        this.refreshing = false;
      }
    });
  }
}
