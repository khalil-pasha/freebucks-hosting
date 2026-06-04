import { Router } from 'express';
import { QueueController } from '../controllers/queue.controller';
import { requireAuth } from '../middleware/auth';

const router = Router();

router.use(requireAuth);

router.post('/start-server', QueueController.startServer);
router.post('/restart-server', QueueController.restartServer);
router.post('/cancel', QueueController.cancel); // Used for bypassing queue / stopping instantly
router.get('/status/:serverId', QueueController.getStatus);
router.get('/my-jobs', QueueController.myJobs);

export default router;
