import { Request, Response } from 'express';
import { CreditsService } from '../services/credits.service';

export class CreditsController {
  public static async getBalance(req: Request, res: Response) {
    try {
      const userId = req.user!.id;
      const data = await CreditsService.getBalance(userId);
      res.json(data);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  public static async hourlyClaim(req: Request, res: Response) {
    try {
      const userId = req.user!.id;
      const data = await CreditsService.claimHourly(userId);
      res.json(data);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  public static async dailySpin(req: Request, res: Response) {
    try {
      const userId = req.user!.id;
      const { rolledAmount } = req.body;
      
      if (typeof rolledAmount !== 'number' || rolledAmount <= 0) {
        return res.status(400).json({ error: 'Invalid rolled amount' });
      }

      const data = await CreditsService.claimDailySpin(userId, rolledAmount);
      res.json(data);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  public static async getHistory(req: Request, res: Response) {
    try {
      const userId = req.user!.id;
      const history = await CreditsService.getHistory(userId);
      res.json(history);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }
}
