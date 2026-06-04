import { Request, Response } from 'express';
import { VoucherService } from '../services/voucher.service';

export class VoucherController {
  public static async redeem(req: Request, res: Response) {
    try {
      const userId = req.user!.id;
      const { code } = req.body;

      if (!code) {
        return res.status(400).json({ error: 'Voucher code is required' });
      }

      const data = await VoucherService.redeemVoucher(userId, code);
      res.json(data);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }
}
