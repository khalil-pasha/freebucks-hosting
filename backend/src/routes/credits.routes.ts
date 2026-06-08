import { Router } from 'express';
import { CreditsController } from '../controllers/credits.controller';
import { requireAuth } from '../middleware/auth';

const router = Router();

router.use(requireAuth);

router.get('/balance', CreditsController.getBalance);
router.get('/rewards/status', CreditsController.getRewardStatus);
router.post('/hourly-claim', CreditsController.hourlyClaim);
router.post('/daily-spin', CreditsController.dailySpin);
router.get('/history', CreditsController.getHistory);

export default router;
