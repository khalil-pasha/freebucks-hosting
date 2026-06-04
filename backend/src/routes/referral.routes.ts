import { Router } from 'express';
import { ReferralController } from '../controllers/referral.controller';
import { requireAuth } from '../middleware/auth';

const router = Router();

router.use(requireAuth);

router.post('/claim', ReferralController.claim);

export default router;
