import { Router } from 'express';
import { ServerController } from '../controllers/server.controller';
import { requireAuth } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { createServerSchema, upgradeServerSchema } from '../validators/server.validator';

const router = Router();

router.use(requireAuth);

router.post('/create', validate(createServerSchema), ServerController.createServer);
router.patch('/:id/upgrade', validate(upgradeServerSchema), ServerController.upgradeServer);
router.get('/rates', ServerController.getRates);
router.get('/my-servers', ServerController.myServers);

export default router;
