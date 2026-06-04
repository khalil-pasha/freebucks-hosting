import { Router } from 'express';
import { ServerController } from '../controllers/server.controller';
import { requireAuth } from '../middleware/auth';

const router = Router();

router.use(requireAuth);

router.post('/create', ServerController.createServer);
router.get('/my-servers', ServerController.myServers);

export default router;
