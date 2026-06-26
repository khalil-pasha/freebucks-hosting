import { Router } from 'express';
import { ProfileController } from '../controllers/profile.controller';
import { requireAuth } from '../middleware/auth';

const router = Router();

router.use(requireAuth);

router.post('/avatar', ProfileController.uploadAvatar);
router.patch('/email', ProfileController.updateEmail);
router.post('/send-password-otp', ProfileController.sendPasswordOtp);
router.post('/reset-panel-password', ProfileController.resetPanelPassword);

router.get('/sessions', ProfileController.getSessions);
router.post('/sessions/revoke-all', ProfileController.revokeAllSessions);

router.get('/preferences', ProfileController.getPreferences);
router.patch('/preferences', ProfileController.updatePreferences);

export default router;
