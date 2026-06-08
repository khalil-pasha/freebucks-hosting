import { Router } from 'express';
import { ProfileController } from '../controllers/profile.controller';
import { requireAuth } from '../middleware/auth';

const router = Router();

router.use(requireAuth);

router.post('/avatar', ProfileController.uploadAvatar);
router.post('/send-password-otp', ProfileController.sendPasswordOtp);
router.post('/reset-panel-password', ProfileController.resetPanelPassword);

export default router;
