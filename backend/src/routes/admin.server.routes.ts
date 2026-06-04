import { Router } from 'express';
import { AdminServerController } from '../controllers/admin.server.controller';
import { requireAuth } from '../middleware/auth';
import { requireAdmin } from '../middleware/admin';

const router = Router();

router.use(requireAuth, requireAdmin);

router.post('/suspend', AdminServerController.suspendServer);
router.post('/delete', AdminServerController.deleteServer);
router.post('/force-stop', AdminServerController.forceStop);

export default router;
