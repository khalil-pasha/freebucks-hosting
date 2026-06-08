import { Request, Response } from 'express';
import { ReferralService } from '../services/referral.service';

export class ReferralController {
  public static async claim(req: Request, res: Response) {
    try {
      // In this specific mock, the user claiming might be the referrer,
      // and we need to pass both referrerId and referredId.
      const userId = req.user!.id;
      const { referredId } = req.body;

      if (!referredId) {
        return res.status(400).json({ error: 'referredId is required' });
      }

      const data = await ReferralService.claimReferralReward(userId, referredId);
      res.json(data);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  public static async getStats(req: Request, res: Response) {
    try {
      const userId = req.user!.id;
      const stats = await ReferralService.getStats(userId);
      res.json(stats);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }
}
