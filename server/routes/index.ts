import { Router, type IRouter } from 'express';
import healthRouter from './health';
import careerRouter from './career';
import accountRouter from './account';

const router: IRouter = Router();

router.use(healthRouter);
router.use(careerRouter);
router.use(accountRouter);

export default router;
