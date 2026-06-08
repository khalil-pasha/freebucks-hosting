import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
import { requireAuth } from '../middleware/auth';
import { generalAuthLimiter, sensitiveAuthLimiter } from '../middleware/security';

const router = Router();

router.get('/discord', generalAuthLimiter, AuthController.login);
router.get('/discord/callback', sensitiveAuthLimiter, AuthController.callback);
router.post('/logout', generalAuthLimiter, AuthController.logout);

// Protected routes
router.get('/me', generalAuthLimiter, requireAuth, AuthController.me);

export default router;
