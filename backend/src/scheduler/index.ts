import cron from 'node-cron';
import { CRON_SCHEDULE, TIMEZONE } from '../config';
import { runIndicator } from '../services/indicator.service';

export function startScheduler(): void {
  cron.schedule(
    CRON_SCHEDULE,
    async () => {
      console.log(`[scheduler] running indicator at ${new Date().toISOString()}`);
      try {
        await runIndicator();
      } catch (err) {
        console.error('[scheduler] run failed:', err);
      }
    },
    { timezone: TIMEZONE }
  );
  console.log(`[scheduler] armed: "${CRON_SCHEDULE}" (${TIMEZONE})`);
}
