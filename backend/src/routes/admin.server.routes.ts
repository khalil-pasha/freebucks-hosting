import { Router } from 'express';
import { AdminServerController } from '../controllers/admin.server.controller';
import { requireAuth } from '../middleware/auth';
import { requireAdmin } from '../middleware/admin';
import { validate } from '../middleware/validate';
import { adminServerActionSchema } from '../validators/admin.validator';

const router = Router();

router.use(requireAuth, requireAdmin);

router.post('/suspend', validate(adminServerActionSchema), AdminServerController.suspendServer);
router.post('/delete', validate(adminServerActionSchema), AdminServerController.deleteServer);
router.post('/force-stop', validate(adminServerActionSchema), AdminServerController.forceStop);

export default router;
