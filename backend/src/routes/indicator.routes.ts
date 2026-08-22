import { Router } from 'express';
import * as indicatorController from '../controllers/indicator.controller';

const router = Router();

router.get('/latest', indicatorController.getLatest);
router.get('/history', indicatorController.getHistory);
router.post('/run-now', indicatorController.runNow);

export default router;
