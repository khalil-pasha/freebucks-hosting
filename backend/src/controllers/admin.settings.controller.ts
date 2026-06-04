import { Request, Response } from 'express';
import { SettingsService } from '../services/settings.service';
import { db } from '../utils/db';

export class AdminSettingsController {
  public static async getAllSettings(req: Request, res: Response) {
    try {
      const settings = await SettingsService.getAll();
      res.json(settings);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  public static async updateSetting(req: Request, res: Response) {
    try {
      const adminId = req.user!.id; 
      const { key, value } = req.body;
      
      if (!key || value === undefined) {
        return res.status(400).json({ error: 'Key and value are required.' });
      }

      const updatedValue = await SettingsService.update(adminId, key, value);
      res.json({ success: true, key, value: updatedValue });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  public static async getAuditLogs(req: Request, res: Response) {
    try {
      const logs = await db.settingAuditLog.findMany({
        orderBy: { timestamp: 'desc' },
        take: 100,
      });
      res.json(logs);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
}
