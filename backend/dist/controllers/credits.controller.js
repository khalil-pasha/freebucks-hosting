"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreditsController = void 0;
const credits_service_1 = require("../services/credits.service");
class CreditsController {
    static async getBalance(req, res) {
        try {
            const userId = req.user.id;
            const data = await credits_service_1.CreditsService.getBalance(userId);
            res.json(data);
        }
        catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
    static async hourlyClaim(req, res) {
        try {
            const userId = req.user.id;
            const data = await credits_service_1.CreditsService.claimHourly(userId);
            res.json(data);
        }
        catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
    static async dailySpin(req, res) {
        try {
            const userId = req.user.id;
            const { rolledAmount } = req.body;
            if (typeof rolledAmount !== 'number' || rolledAmount <= 0) {
                return res.status(400).json({ error: 'Invalid rolled amount' });
            }
            const data = await credits_service_1.CreditsService.claimDailySpin(userId, rolledAmount);
            res.json(data);
        }
        catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
    static async getHistory(req, res) {
        try {
            const userId = req.user.id;
            const history = await credits_service_1.CreditsService.getHistory(userId);
            res.json(history);
        }
        catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
}
exports.CreditsController = CreditsController;
