"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminSettingsController = void 0;
const settings_service_1 = require("../services/settings.service");
const db_1 = require("../utils/db");
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
            res.json({ success: true, key, value: updatedValue });
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
