import { Router } from 'express';
import { AdminSupportController } from '../controllers/admin.support.controller';
import { requireAuth } from '../middleware/auth';
import { requireAdmin } from '../middleware/admin';

const router = Router();

router.use(requireAuth, requireAdmin);

router.get('/', AdminSupportController.getAllTickets);
router.get('/:id', AdminSupportController.getTicketById);
router.post('/:id/reply', AdminSupportController.reply);
router.post('/:id/close', AdminSupportController.closeTicket);
router.post('/:id/reopen', AdminSupportController.reopenTicket);

export default router;
