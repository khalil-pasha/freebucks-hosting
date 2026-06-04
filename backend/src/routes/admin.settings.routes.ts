import { Router } from 'express';
import { AdminSettingsController } from '../controllers/admin.settings.controller';
import { requireAuth } from '../middleware/auth';
import { requireAdmin } from '../middleware/admin';

const router = Router();

router.use(requireAuth, requireAdmin);

router.get('/', AdminSettingsController.getAllSettings);
router.post('/', AdminSettingsController.updateSetting);
router.get('/logs', AdminSettingsController.getAuditLogs);

export default router;
