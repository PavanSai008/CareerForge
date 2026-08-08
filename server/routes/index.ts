import { Router, type IRouter } from 'express';
import healthRouter from './health.js';
import careerRouter from './career.js';
import accountRouter from './account.js';

const router: IRouter = Router();

router.use(healthRouter);
router.use(careerRouter);
router.use(accountRouter);

export default router;
