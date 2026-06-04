import { Request, Response } from 'express';
import { VoucherService } from '../services/voucher.service';
import { AuditService } from '../services/audit.service';

export class VoucherController {
  public static async redeem(req: Request, res: Response) {
    try {
      const userId = req.user!.id;
      const { code } = req.body;

      if (!code) {
        return res.status(400).json({ error: 'Voucher code is required' });
      }

      const data = await VoucherService.redeemVoucher(userId, code);
      await AuditService.logAction(req, 'VOUCHER_REDEEM', code, userId);
      res.json(data);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }
}
