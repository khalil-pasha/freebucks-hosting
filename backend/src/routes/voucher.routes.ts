import { Router } from 'express';
import { VoucherController } from '../controllers/voucher.controller';
import { requireAuth } from '../middleware/auth';

const router = Router();

router.use(requireAuth);

router.post('/redeem', VoucherController.redeem);

export default router;
