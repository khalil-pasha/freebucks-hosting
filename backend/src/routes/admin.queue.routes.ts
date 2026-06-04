import { Router } from 'express';
import { AdminQueueController } from '../controllers/admin.queue.controller';
import { requireAuth } from '../middleware/auth';
import { requireAdmin } from '../middleware/admin';

const router = Router();

router.use(requireAuth, requireAdmin);

router.post('/pause', AdminQueueController.pause);
router.post('/resume', AdminQueueController.resume);
router.post('/cancel', AdminQueueController.cancel);
router.post('/retry', AdminQueueController.retry);
router.get('/active', AdminQueueController.activeSlots);

export default router;
