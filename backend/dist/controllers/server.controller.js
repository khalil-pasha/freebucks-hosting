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
            const { name, ramGB, cpu, disk, pterodactyl, selectedEgg } = req.body;
            if (!name || !ramGB || !cpu || !disk) {
                return res.status(400).json({ error: 'Missing required server parameters' });
            }
            const user = await db_1.db.user.findUnique({
                where: { id: userId },
                include: {
                    premiumOrders: {
                        where: {
                            status: 'COMPLETED',
                            expiresAt: { gt: new Date() }
                        }
                    },
                    servers: { where: { status: { notIn: ['ARCHIVED'] } } }
                }
            });
            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }
            if (user.balance <= 0) {
                console.log(`[CREDITS] Server creation blocked due to insufficient credits`);
                return res.status(400).json({ error: 'Insufficient credits to create a server. Please top up your balance.' });
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
            const isPremium = user.premiumOrders.length > 0;
            if (ramGB === 2 && cpu === 100 && disk === 5)
                costPerHour = await settings_service_1.SettingsService.getNumber('serverRate2GB');
            else if (ramGB === 4 && cpu === 150 && disk === 10)
                costPerHour = await settings_service_1.SettingsService.getNumber('serverRate4GB');
            else if (ramGB === 6 && cpu === 200 && disk === 15)
                costPerHour = await settings_service_1.SettingsService.getNumber('serverRate6GB');
            else if (ramGB === 8 && cpu === 300 && disk === 30) {
                if (!isPremium)
                    return res.status(403).json({ error: 'Premium Plan requires an active Premium Subscription.' });
                costPerHour = 0;
            }
            else {
                return res.status(400).json({ error: 'Invalid server plan selected.' });
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
            let finalEgg = 'paper';
            if (isPremium && selectedEgg) {
                const allowedEggs = ['paper', 'forge', 'vanilla', 'bungeecord', 'sponge'];
                if (!allowedEggs.includes(selectedEgg.toLowerCase())) {
                    return res.status(400).json({ error: 'Invalid server software selected.' });
                }
                finalEgg = selectedEgg.toLowerCase();
            }
            const pteroData = await pterodactyl_service_1.PterodactylService.createServer(name, ramGB, cpu, disk, pteroUserId, finalEgg);
            const server = await db_1.db.server.create({
                data: {
                    userId,
                    name,
                    ramGB,
                    cpu,
                    disk,
                    costPerHour,
                    status: 'STOPPED',
                    eggType: finalEgg,
                    pterodactylServerId: pteroData.id,
                    pterodactylIdentifier: pteroData.identifier,
                }
            });
            await audit_service_1.AuditService.logAction(req, 'SERVER_CREATE', server.id, userId);
            res.status(201).json(server);
        }
        catch (error) {
            console.error('[ServerCreate] Failed:', error?.response?.data || error);
            let errorMessage = 'An unknown error occurred while creating the server.';
            if (error?.response?.data?.errors && Array.isArray(error.response.data.errors) && error.response.data.errors.length > 0) {
                errorMessage = error.response.data.errors.map((e) => `${e.detail || e.title}`).join(' | ');
            }
            else if (error?.response?.data?.message) {
                errorMessage = error.response.data.message;
            }
            else if (error?.message) {
                errorMessage = error.message;
            }
            res.status(400).json({ error: `Pterodactyl Create Error: ${errorMessage}` });
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
                include: {
                    premiumOrders: {
                        where: {
                            status: 'COMPLETED',
                            expiresAt: { gt: new Date() }
                        }
                    }
                }
            });
            const isPremium = !!(user && user.premiumOrders.length > 0);
            let costPerHour = 0;
            if (ramGB === 2 && cpu === 100 && disk === 5)
                costPerHour = await settings_service_1.SettingsService.getNumber('serverRate2GB');
            else if (ramGB === 4 && cpu === 150 && disk === 10)
                costPerHour = await settings_service_1.SettingsService.getNumber('serverRate4GB');
            else if (ramGB === 6 && cpu === 200 && disk === 15)
                costPerHour = await settings_service_1.SettingsService.getNumber('serverRate6GB');
            else if (ramGB === 8 && cpu === 300 && disk === 30) {
                if (!isPremium)
                    return res.status(403).json({ error: 'Premium Plan requires an active Premium Subscription.' });
                costPerHour = 0;
            }
            else {
                return res.status(400).json({ error: 'Invalid server plan selected.' });
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
            const servers = await db_1.db.server.findMany({
                where: {
                    OR: [
                        { userId },
                        { accesses: { some: { userId } } }
                    ]
                },
                include: { accesses: true }
            });
            const enrichedServers = await Promise.all(servers.map(async (server) => {
                const allocation = await pterodactyl_service_1.PterodactylService.getServerAllocation(server.pterodactylIdentifier);
                let liveStatus = 'OFFLINE';
                let liveUsage = { cpu: 0, memory_bytes: 0, disk_bytes: 0 };
                try {
                    const stats = await pterodactyl_service_1.PterodactylService.getServerStatus(server.pterodactylIdentifier);
                    const stateMap = {
                        'running': 'ONLINE',
                        'offline': 'OFFLINE',
                        'starting': 'STARTING',
                        'stopping': 'STOPPING'
                    };
                    liveStatus = stateMap[stats.current_state] || stats.current_state?.toUpperCase() || 'OFFLINE';
                    liveUsage = {
                        cpu: stats.resources?.cpu_absolute || 0,
                        memory_bytes: stats.resources?.memory_bytes || 0,
                        disk_bytes: stats.resources?.disk_bytes || 0
                    };
                }
                catch (err) {
                    // Ignore if daemon offline
                }
                return {
                    ...server,
                    allocationIp: allocation?.ip || null,
                    allocationAlias: allocation?.alias || null,
                    allocationPort: allocation?.port || null,
                    liveStatus,
                    liveUsage,
                    isShared: server.userId !== userId,
                    permissions: server.userId === userId ? ['admin'] : JSON.parse(server.accesses.find((a) => a.userId === userId)?.permissions || '[]')
                };
            }));
            res.json(enrichedServers);
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
    static async getRates(req, res) {
        try {
            const serverRate2GB = await settings_service_1.SettingsService.getNumber('serverRate2GB');
            const serverRate4GB = await settings_service_1.SettingsService.getNumber('serverRate4GB');
            const serverRate6GB = await settings_service_1.SettingsService.getNumber('serverRate6GB');
            res.json({
                serverRate2GB,
                serverRate4GB,
                serverRate6GB
            });
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}
exports.ServerController = ServerController;
