import express, { Express } from 'express';
import cors from 'cors';
import apiRoutes from './routes';

export function createApp(): Express {
  const app = express();

  app.use(cors());
  app.use(express.json());

  app.use('/api', apiRoutes);

  return app;
}
