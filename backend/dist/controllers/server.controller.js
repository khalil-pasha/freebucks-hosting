"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServerController = void 0;
const db_1 = require("../utils/db");
const pterodactyl_service_1 = require("../services/pterodactyl.service");
const audit_service_1 = require("../services/audit.service");
const settings_service_1 = require("../services/settings.service");
class ServerController {
    static async createServer(req, res) {
        try {
            const userId = req.user.id;
            const { name, ramGB, cpu, disk, pterodactyl } = req.body;
            if (!name || !ramGB || !cpu || !disk) {
                return res.status(400).json({ error: 'Missing required server parameters' });
            }
            const user = await db_1.db.user.findUnique({
                where: { id: userId },
                include: {
                    premiumOrders: { where: { status: 'COMPLETED' } },
                    servers: { where: { status: { notIn: ['ARCHIVED'] } } }
                }
            });
            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }
            if (user.premiumOrders.length === 0 && user.servers.length >= 1) {
                return res.status(403).json({ error: 'You already have an active free server. Upgrade to premium to create more servers.' });
            }
            const globalServerCap = await settings_service_1.SettingsService.getNumber('globalServerCap');
            const totalActiveServers = await db_1.db.server.count({ where: { status: { notIn: ['ARCHIVED'] } } });
            if (totalActiveServers >= globalServerCap) {
                return res.status(403).json({ error: 'Global server capacity reached. Please try again later.' });
            }
            let costPerHour = 0;
            if (ramGB === 2 && cpu === 100 && disk === 5)
                costPerHour = await settings_service_1.SettingsService.getNumber('serverRate2GB');
            else if (ramGB === 4 && cpu === 150 && disk === 10)
                costPerHour = await settings_service_1.SettingsService.getNumber('serverRate4GB');
            else if (ramGB === 6 && cpu === 200 && disk === 15)
                costPerHour = await settings_service_1.SettingsService.getNumber('serverRate6GB');
            else {
                if (user.premiumOrders.length === 0) {
                    return res.status(403).json({ error: '8GB+ or Custom servers require an active Premium Order.' });
                }
                costPerHour = 0; // Premium users don't burn credits for their allocated limits
            }
            let pteroUserId = user.pterodactylUserId;
            if (!pteroUserId) {
                if (!pterodactyl || !pterodactyl.email || !pterodactyl.username || !pterodactyl.firstName || !pterodactyl.lastName || !pterodactyl.password) {
                    return res.status(400).json({ error: 'Pterodactyl user details required for first-time server creation.' });
                }
                pteroUserId = await pterodactyl_service_1.PterodactylService.createUser(pterodactyl.email, pterodactyl.username, pterodactyl.firstName, pterodactyl.lastName, pterodactyl.password);
                await db_1.db.user.update({
                    where: { id: userId },
                    data: { pterodactylUserId: pteroUserId }
                });
            }
            const pteroData = await pterodactyl_service_1.PterodactylService.createServer(name, ramGB, cpu, disk, pteroUserId);
            const server = await db_1.db.server.create({
                data: {
                    userId,
                    name,
                    ramGB,
                    cpu,
                    disk,
                    costPerHour,
                    status: 'STOPPED',
                    pterodactylServerId: pteroData.id,
                    pterodactylIdentifier: pteroData.identifier,
                }
            });
            await audit_service_1.AuditService.logAction(req, 'SERVER_CREATE', server.id, userId);
            res.status(201).json(server);
        }
        catch (error) {
            console.error(error.response?.data || error);
            const errorMessage = error.response?.data?.errors?.[0]?.detail || error.response?.data?.message || error.message || 'An unknown error occurred while creating the server.';
            res.status(500).json({ error: errorMessage });
        }
    }
    static async upgradeServer(req, res) {
        try {
            const userId = req.user.id;
            const serverId = req.params.id;
            const { ramGB, cpu, disk } = req.body;
            const server = await db_1.db.server.findFirst({
                where: { id: serverId, userId }
            });
            if (!server) {
                return res.status(404).json({ error: 'Server not found' });
            }
            const user = await db_1.db.user.findUnique({
                where: { id: userId },
                include: { premiumOrders: { where: { status: 'COMPLETED' } } }
            });
            let costPerHour = 0;
            if (ramGB === 2 && cpu === 100 && disk === 5)
                costPerHour = await settings_service_1.SettingsService.getNumber('serverRate2GB');
            else if (ramGB === 4 && cpu === 150 && disk === 10)
                costPerHour = await settings_service_1.SettingsService.getNumber('serverRate4GB');
            else if (ramGB === 6 && cpu === 200 && disk === 15)
                costPerHour = await settings_service_1.SettingsService.getNumber('serverRate6GB');
            else {
                if (!user || user.premiumOrders.length === 0) {
                    return res.status(403).json({ error: '8GB+ or Custom servers require an active Premium Order.' });
                }
                costPerHour = 0;
            }
            await pterodactyl_service_1.PterodactylService.updateServerBuild(server.pterodactylServerId, ramGB, cpu, disk);
            const updatedServer = await db_1.db.server.update({
                where: { id: serverId },
                data: { ramGB, cpu, disk, costPerHour }
            });
            await audit_service_1.AuditService.logAction(req, 'SERVER_UPGRADE', serverId, userId);
            res.json(updatedServer);
        }
        catch (error) {
            console.error(error.response?.data || error);
            res.status(500).json({ error: 'Failed to upgrade server' });
        }
    }
    static async myServers(req, res) {
        try {
            const userId = req.user.id;
            const servers = await db_1.db.server.findMany({ where: { userId } });
            const enrichedServers = await Promise.all(servers.map(async (server) => {
                const allocation = await pterodactyl_service_1.PterodactylService.getServerAllocation(server.pterodactylIdentifier);
                return {
                    ...server,
                    allocationIp: allocation?.ip || null,
                    allocationAlias: allocation?.alias || null,
                    allocationPort: allocation?.port || null,
                };
            }));
            res.json(enrichedServers);
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}
exports.ServerController = ServerController;
