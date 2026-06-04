"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QueueController = void 0;
const queue_service_1 = require("../services/queue.service");
const db_1 = require("../utils/db");
class QueueController {
    static async startServer(req, res) {
        try {
            const userId = req.user.id;
            const { serverId } = req.body;
            if (!serverId) {
                return res.status(400).json({ error: 'serverId is required' });
            }
            // Verify server ownership
            const server = await db_1.db.server.findUnique({ where: { id: serverId } });
            if (!server || server.userId !== userId) {
                return res.status(403).json({ error: 'Server not found or unauthorized' });
            }
            const data = await queue_service_1.QueueService.addStartJob(userId, serverId);
            res.json(data);
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
    static async restartServer(req, res) {
        try {
            const userId = req.user.id;
            const { serverId } = req.body;
            if (!serverId) {
                return res.status(400).json({ error: 'serverId is required' });
            }
            const server = await db_1.db.server.findUnique({ where: { id: serverId } });
            if (!server || server.userId !== userId) {
                return res.status(403).json({ error: 'Server not found or unauthorized' });
            }
            const data = await queue_service_1.QueueService.addRestartJob(userId, serverId);
            res.json(data);
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
    static async cancel(req, res) {
        try {
            const userId = req.user.id;
            const { serverId } = req.body;
            if (!serverId)
                return res.status(400).json({ error: 'serverId is required' });
            // If they are stopping it completely bypasses queue
            const data = await queue_service_1.QueueService.stopServer(userId, serverId);
            res.json(data);
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
    static async getStatus(req, res) {
        try {
            const serverId = req.params.serverId;
            const data = await queue_service_1.QueueService.getStatus(serverId);
            res.json(data);
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
    static async myJobs(req, res) {
        try {
            const userId = req.user.id;
            const data = await queue_service_1.QueueService.getMyJobs(userId);
            res.json(data);
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}
exports.QueueController = QueueController;
