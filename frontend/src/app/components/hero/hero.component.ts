import { Component, Input } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Run } from '../../models/run.model';
import { DIRECTION_CLASS, VOLATILITY_CLASS, VOLATILITY_TEXT } from '../../shared/format';
import { ICONS } from '../../shared/icons';

// Ported verbatim from public/app.js renderHero(). `run` is:
//  - undefined -> initial "Loading…" state (matches the static markup in the old index.html)
//  - null      -> API responded but there is no run yet ("No runs yet")
//  - Run       -> full computed hero
@Component({
  selector: 'app-hero',
  templateUrl: './hero.component.html',
  styleUrls: ['./hero.component.css']
})
export class HeroComponent {
  @Input() run: Run | null | undefined;

  constructor(private sanitizer: DomSanitizer) {}

  get valueText(): string {
    if (this.run === undefined) return 'Loading…';
    if (this.run === null) return 'No runs yet';
    return this.run.combined.label;
  }

  get valueClass(): string {
    if (!this.run) return 'neutral';
    return DIRECTION_CLASS[this.run.direction.call];
  }

  get ringInnerClass(): string {
    return this.valueClass;
  }

  get ringInnerIcon(): SafeHtml {
    if (!this.run) return this.trust('');
    const cls = DIRECTION_CLASS[this.run.direction.call];
    const svg = cls === 'bullish' ? ICONS.trendUp : cls === 'bearish' ? ICONS.trendDown : ICONS.dash;
    return this.trust(svg);
  }

  get ringBackground(): string | null {
    if (!this.run) return null;
    const cls = DIRECTION_CLASS[this.run.direction.call];
    const counts = this.run.direction.counts;
    const arcCount =
      this.run.direction.call === 'BULLISH' ? counts.bullish : this.run.direction.call === 'BEARISH' ? counts.bearish : Math.max(counts.neutral, 1);
    const arcPercent = (arcCount / 4) * 100;
    const arcVar = `var(--${cls === 'neutral' ? 'neutral' : cls})`;
    const trackVar = `var(--${cls === 'neutral' ? 'neutral-track' : cls + '-track'})`;
    return `conic-gradient(${arcVar} 0% ${arcPercent}%, ${trackVar} ${arcPercent}% 100%)`;
  }

  get metaHtml(): SafeHtml {
    if (!this.run) return this.trust('');
    const volClass = VOLATILITY_CLASS[this.run.volatility.state];
    const counts = this.run.direction.counts;
    const html = `
      <span>${counts.bullish} bullish &middot; ${counts.bearish} bearish &middot; ${counts.neutral} neutral (of 4 direction signals)</span>
      <span class="badge ${volClass}"><span class="dot"></span>${VOLATILITY_TEXT[this.run.volatility.state]}${
      this.run.volatility.value != null ? ` (VIX ${this.run.volatility.value.toFixed(2)})` : ''
    }</span>
    `;
    return this.trust(html);
  }

  private trust(html: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(html);
  }
}
