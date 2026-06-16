import { Router } from 'express';
import { ServerController } from '../controllers/server.controller';
import { ServerPanelController } from '../controllers/server-panel.controller';
import { requireAuth } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { createServerSchema, upgradeServerSchema } from '../validators/server.validator';

const router = Router();

router.use(requireAuth);

// User-facing Invites
router.get('/invites', ServerPanelController.listUserInvites);
router.post('/invites/:inviteId/accept', ServerPanelController.acceptInvite);
router.post('/invites/:inviteId/decline', ServerPanelController.declineInvite);

router.post('/create', validate(createServerSchema), ServerController.createServer);
router.patch('/:id/upgrade', validate(upgradeServerSchema), ServerController.upgradeServer);
router.get('/rates', ServerController.getRates);
router.get('/my-servers', ServerController.myServers);

export default router;
