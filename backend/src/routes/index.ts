import { Router } from 'express';
import indicatorRoutes from './indicator.routes';

const router = Router();

// Mounted at /api in app.ts. To add a new feature: create controllers/<name>.controller.ts,
// services/<name>.service.ts, routes/<name>.routes.ts, then register it here, e.g.:
//   import fooRoutes from './foo.routes';
//   router.use('/foo', fooRoutes);
router.use('/', indicatorRoutes);

export default router;
