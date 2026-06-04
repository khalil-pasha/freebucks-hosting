import { Router } from 'express';
import { ServerController } from '../controllers/server.controller';
import { requireAuth } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { createServerSchema } from '../validators/server.validator';

const router = Router();

router.use(requireAuth);

router.post('/', validate(createServerSchema), ServerController.createServer);
router.get('/', ServerController.myServers);

export default router;
