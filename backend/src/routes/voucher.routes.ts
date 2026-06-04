import { Router } from 'express';
import { VoucherController } from '../controllers/voucher.controller';
import { requireAuth } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { redeemVoucherSchema } from '../validators/voucher.validator';

const router = Router();

router.use(requireAuth);

router.post('/redeem', validate(redeemVoucherSchema), VoucherController.redeem);

export default router;
