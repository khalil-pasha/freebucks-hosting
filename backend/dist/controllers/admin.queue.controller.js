"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminQueueController = void 0;
const queue_service_1 = require("../services/queue.service");
class AdminQueueController {
    static async pause(req, res) {
        try {
            const data = await queue_service_1.AdminQueueService.pauseQueue();
            res.json(data);
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
    static async resume(req, res) {
        try {
            const data = await queue_service_1.AdminQueueService.resumeQueue();
            res.json(data);
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
    static async cancel(req, res) {
        try {
            const { bullJobId } = req.body;
            const data = await queue_service_1.AdminQueueService.cancelJob(bullJobId);
            res.json(data);
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
    static async retry(req, res) {
        try {
            const { bullJobId } = req.body;
            const data = await queue_service_1.AdminQueueService.retryJob(bullJobId);
            res.json(data);
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
    static async activeSlots(req, res) {
        try {
            const active = await queue_service_1.AdminQueueService.getActiveSlots();
            const waiting = await queue_service_1.AdminQueueService.getWaitingJobs();
            res.json({ ...active, waiting });
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}
exports.AdminQueueController = AdminQueueController;
