import { Component, Input } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Run, Signal, SignalKey } from '../../models/run.model';
import { DIRECTION_CLASS, DIRECTION_TEXT, VOLATILITY_TEXT, formatTime, voteClass, voteIconSvg } from '../../shared/format';
import { ICONS } from '../../shared/icons';

// Ported verbatim from public/app.js renderHistory().
const DIRECTION_ORDER: SignalKey[] = ['nasdaq', 'dow', 'breadth', 'giftNifty'];

interface HistoryCell {
  cls: string;
  icon: SafeHtml;
}

interface HistoryRow {
  time: string;
  dirCls: string;
  dirText: string;
  volText: string;
  cells: HistoryCell[];
  vixText: string;
}

@Component({
  selector: 'app-history-table',
  templateUrl: './history-table.component.html',
  styleUrls: ['./history-table.component.css']
})
export class HistoryTableComponent {
  @Input() history: Run[] = [];

  constructor(private sanitizer: DomSanitizer) {}

  get rows(): HistoryRow[] {
    return this.history.map((run) => {
      const byKey: Partial<Record<SignalKey, Signal>> = {};
      run.signals.forEach((s) => (byKey[s.key] = s));

      const cells: HistoryCell[] = DIRECTION_ORDER.map((key) => {
        const s = byKey[key];
        if (!s || !s.ok) return { cls: 'neutral', icon: this.trust(ICONS.dash) };
        return { cls: voteClass(s.vote), icon: this.trust(voteIconSvg(s.vote)) };
      });

      const vix = byKey.vix;
      const vixText = vix && vix.ok && vix.raw?.value != null ? vix.raw.value.toFixed(2) : '—';

      return {
        time: formatTime(run.timestamp),
        dirCls: DIRECTION_CLASS[run.direction.call],
        dirText: DIRECTION_TEXT[run.direction.call],
        volText: VOLATILITY_TEXT[run.volatility.state],
        cells,
        vixText
      };
    });
  }

  private trust(html: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(html);
  }
}
