import { runIndicator } from '../services/indicator.service';

runIndicator()
  .then((run) => {
    console.log(JSON.stringify(run, null, 2));
  })
  .catch((err) => {
    console.error('Indicator run failed:', err);
    process.exit(1);
  });
