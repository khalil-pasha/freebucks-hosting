import { Router } from 'express';
import { PremiumController } from '../controllers/premium.controller';
import { requireAuth } from '../middleware/auth';

const router = Router();

router.use(requireAuth);

router.post('/create-order', PremiumController.createOrder);
router.post('/verify-payment', PremiumController.verifyPayment);
router.get('/status', PremiumController.status);

export default router;
