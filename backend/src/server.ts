import { createApp } from './app';
import { PORT } from './config';
import { startScheduler } from './scheduler';

const app = createApp();

app.listen(PORT, () => {
  console.log(`Market indicator dashboard running at http://localhost:${PORT}`);
  startScheduler();
});
