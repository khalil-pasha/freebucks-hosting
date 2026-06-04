"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminServerController = void 0;
const db_1 = require("../utils/db");
const pterodactyl_service_1 = require("../services/pterodactyl.service");
class AdminServerController {
    static async suspendServer(req, res) {
        try {
            const { serverId } = req.body;
            const server = await db_1.db.server.findUnique({ where: { id: serverId } });
            if (!server || !server.pterodactylServerId)
                return res.status(404).json({ error: 'Server not found' });
            await pterodactyl_service_1.PterodactylService.suspendServer(server.pterodactylServerId);
            await db_1.db.server.update({
                where: { id: serverId },
                data: { status: 'ARCHIVED' }
            });
            res.json({ success: true });
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
    static async deleteServer(req, res) {
        try {
            const { serverId } = req.body;
            const server = await db_1.db.server.findUnique({ where: { id: serverId } });
            if (!server || !server.pterodactylServerId)
                return res.status(404).json({ error: 'Server not found' });
            await pterodactyl_service_1.PterodactylService.deleteServer(server.pterodactylServerId);
            await db_1.db.server.delete({ where: { id: serverId } });
            res.json({ success: true });
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
    static async forceStop(req, res) {
        try {
            const { serverId } = req.body;
            const server = await db_1.db.server.findUnique({ where: { id: serverId } });
            if (!server || !server.pterodactylIdentifier)
                return res.status(404).json({ error: 'Server not found' });
            await pterodactyl_service_1.PterodactylService.stopServer(server.pterodactylIdentifier);
            await db_1.db.server.update({
                where: { id: serverId },
                data: { status: 'STOPPED' }
            });
            res.json({ success: true });
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}
exports.AdminServerController = AdminServerController;
