"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminServerController = void 0;
const db_1 = require("../utils/db");
const pterodactyl_service_1 = require("../services/pterodactyl.service");
const audit_service_1 = require("../services/audit.service");
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
            await audit_service_1.AuditService.logAction(req, 'ADMIN_SUSPEND_SERVER', serverId, req.user.id);
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
            await audit_service_1.AuditService.logAction(req, 'ADMIN_DELETE_SERVER', serverId, req.user.id);
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
            await audit_service_1.AuditService.logAction(req, 'ADMIN_FORCE_STOP_SERVER', serverId, req.user.id);
            res.json({ success: true });
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}
exports.AdminServerController = AdminServerController;
