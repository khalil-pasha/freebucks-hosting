"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminSettingsController = void 0;
const settings_service_1 = require("../services/settings.service");
const db_1 = require("../utils/db");
const audit_service_1 = require("../services/audit.service");
const queue_service_1 = require("../services/queue.service");
class AdminSettingsController {
    static async getAllSettings(req, res) {
        try {
            const settings = await settings_service_1.SettingsService.getAll();
            res.json(settings);
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
    static async updateSetting(req, res) {
        try {
            const adminId = req.user.id;
            const { key, value } = req.body;
            if (!key || value === undefined) {
                return res.status(400).json({ error: 'Key and value are required.' });
            }
            const updatedValue = await settings_service_1.SettingsService.update(adminId, key, value);
            if (key === 'queueConcurrency') {
                queue_service_1.worker.concurrency = Number(value);
                console.log(`[QueueService] Allocator updated with new concurrency: ${value}`);
            }
            await audit_service_1.AuditService.logAction(req, 'SETTINGS_UPDATE', key, adminId);
            res.json({ success: true, key, value: updatedValue });
        }
        catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
    static async batchUpdateSettings(req, res) {
        try {
            const adminId = req.user.id;
            const { updates } = req.body; // Array of {key, value}
            if (!updates || !Array.isArray(updates)) {
                return res.status(400).json({ error: 'Updates array is required.' });
            }
            const updatedValues = await settings_service_1.SettingsService.batchUpdate(adminId, updates);
            const concurrencyUpdate = updates.find(u => u.key === 'queueConcurrency');
            if (concurrencyUpdate) {
                queue_service_1.worker.concurrency = Number(concurrencyUpdate.value);
                console.log(`[QueueService] Allocator updated with new concurrency: ${concurrencyUpdate.value}`);
            }
            await audit_service_1.AuditService.logAction(req, 'SETTINGS_BATCH_UPDATE', 'Multiple', adminId);
            res.json({ success: true, results: updatedValues });
        }
        catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
    static async getAuditLogs(req, res) {
        try {
            const logs = await db_1.db.settingAuditLog.findMany({
                orderBy: { timestamp: 'desc' },
                take: 100,
            });
            res.json(logs);
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}
exports.AdminSettingsController = AdminSettingsController;
