import { Router } from 'express';
import { AdminBillingController } from '../controllers/admin.billing.controller';
import { requireAuth } from '../middleware/auth';
import { requireAdmin } from '../middleware/admin';

const router = Router();

router.use(requireAuth, requireAdmin);

router.get('/logs', AdminBillingController.getLogs);
router.get('/running-servers', AdminBillingController.getRunningServers);
router.get('/auto-stopped', AdminBillingController.getAutoStopped);
router.get('/stats', AdminBillingController.getStats);

export default router;
