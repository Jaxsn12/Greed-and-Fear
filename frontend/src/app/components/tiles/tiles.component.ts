import { Component, Input } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Run, Signal } from '../../models/run.model';
import { tileSpec, TileSpec } from '../../shared/format';

// Ported verbatim from public/app.js renderTiles()/tileSpec().
interface RenderableTile extends Omit<TileSpec, 'icon'> {
  ok: boolean;
  icon: SafeHtml;
}

@Component({
  selector: 'app-tiles',
  templateUrl: './tiles.component.html',
  styleUrls: ['./tiles.component.css']
})
export class TilesComponent {
  @Input() run: Run | null | undefined;

  constructor(private sanitizer: DomSanitizer) {}

  get tiles(): RenderableTile[] {
    if (!this.run) return [];
    return this.run.signals.map((signal: Signal) => {
      const spec = tileSpec(signal);
      return { ...spec, ok: signal.ok, icon: this.sanitizer.bypassSecurityTrustHtml(spec.icon) };
    });
  }
}
