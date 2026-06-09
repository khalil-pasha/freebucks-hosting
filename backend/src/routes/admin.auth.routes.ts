import { Router } from 'express';
import { AdminAuthController } from '../controllers/admin.auth.controller';

const router = Router();

router.post('/login', AdminAuthController.login);
router.post('/logout', AdminAuthController.logout);
router.get('/me', AdminAuthController.me);
router.post('/change-password', AdminAuthController.changePassword);
router.post('/forgot-password', AdminAuthController.forgotPassword);
router.post('/verify-otp', AdminAuthController.verifyOtp);
router.post('/reset-password', AdminAuthController.resetPassword);

export default router;
