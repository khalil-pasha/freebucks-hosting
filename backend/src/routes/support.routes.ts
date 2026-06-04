import { Router } from 'express';
import { SupportController } from '../controllers/support.controller';
import { requireAuth } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { createTicketSchema, replyTicketSchema } from '../validators/ticket.validator';

const router = Router();

router.use(requireAuth);

router.post('/', validate(createTicketSchema), SupportController.createTicket);
router.get('/', SupportController.getMyTickets);
router.get('/:id', SupportController.getTicketById);
router.post('/:id/reply', validate(replyTicketSchema), SupportController.reply);

export default router;
