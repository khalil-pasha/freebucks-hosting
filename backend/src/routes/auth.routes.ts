import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
import { requireAuth } from '../middleware/auth';

const router = Router();

router.get('/discord', AuthController.login);
router.get('/discord/callback', AuthController.callback);
router.post('/logout', AuthController.logout);

// Protected routes
router.get('/me', requireAuth, AuthController.me);

export default router;
