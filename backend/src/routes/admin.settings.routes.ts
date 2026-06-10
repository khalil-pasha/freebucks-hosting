import { Router } from 'express';
import { AdminSettingsController } from '../controllers/admin.settings.controller';
import { requireAuth } from '../middleware/auth';
import { requireAdmin } from '../middleware/admin';
import { validate } from '../middleware/validate';
import { updateSettingSchema } from '../validators/settings.validator';

const router = Router();

router.use(requireAuth, requireAdmin);

router.get('/', AdminSettingsController.getAllSettings);
router.post('/batch', AdminSettingsController.batchUpdateSettings);
router.post('/', validate(updateSettingSchema), AdminSettingsController.updateSetting);
router.get('/logs', AdminSettingsController.getAuditLogs);

export default router;
