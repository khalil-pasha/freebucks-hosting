import { Request, Response } from 'express';
import { SettingsService } from '../services/settings.service';
import { db } from '../utils/db';
import { AuditService } from '../services/audit.service';
import { worker } from '../services/queue.service';

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
      
      if (key === 'queueConcurrency') {
        worker.concurrency = Number(value);
        console.log(`[QueueService] Allocator updated with new concurrency: ${value}`);
      }

      await AuditService.logAction(req, 'SETTINGS_UPDATE', key, adminId);
      res.json({ success: true, key, value: updatedValue });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  public static async batchUpdateSettings(req: Request, res: Response) {
    try {
      const adminId = req.user!.id; 
      const { updates } = req.body; // Array of {key, value}
      
      if (!updates || !Array.isArray(updates)) {
        return res.status(400).json({ error: 'Updates array is required.' });
      }

      const updatedValues = await SettingsService.batchUpdate(adminId, updates);
      
      const concurrencyUpdate = updates.find(u => u.key === 'queueConcurrency');
      if (concurrencyUpdate) {
        worker.concurrency = Number(concurrencyUpdate.value);
        console.log(`[QueueService] Allocator updated with new concurrency: ${concurrencyUpdate.value}`);
      }

      await AuditService.logAction(req, 'SETTINGS_BATCH_UPDATE', 'Multiple', adminId);
      res.json({ success: true, results: updatedValues });
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
