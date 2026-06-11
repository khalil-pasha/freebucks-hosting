import { Router } from 'express';
import { AdminCoreController } from '../controllers/admin.core.controller';
import { requireAuth } from '../middleware/auth';
import { requireAdmin } from '../middleware/admin';

const router = Router();

router.use(requireAuth, requireAdmin);

router.get('/stats', AdminCoreController.getDashboardStats);
router.get('/search', AdminCoreController.globalSearch);
router.get('/notifications', AdminCoreController.getNotifications);
router.post('/notifications/read-all', AdminCoreController.markAllNotificationsRead);
router.post('/notifications/:id/read', AdminCoreController.markNotificationRead);
router.get('/users', AdminCoreController.getUsers);
router.get('/servers', AdminCoreController.getServers);
router.get('/credits', AdminCoreController.getCredits);
router.post('/credits/add', AdminCoreController.addCredits);
router.post('/credits/remove', AdminCoreController.removeCredits);
router.post('/credits/reset', AdminCoreController.resetCredits);
router.get('/vouchers', AdminCoreController.getVouchers);
router.post('/vouchers', AdminCoreController.createVoucher);
router.delete('/vouchers/:id', AdminCoreController.deleteVoucher);
router.get('/referrals', AdminCoreController.getReferrals);
router.get('/premium', AdminCoreController.getPremiumOrders);
router.get('/logs', AdminCoreController.getLogs);
router.get('/tickets', AdminCoreController.getTickets);
router.get('/users/:id', AdminCoreController.getUser);

export default router;
