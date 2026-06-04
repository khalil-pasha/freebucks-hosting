"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServerController = void 0;
const db_1 = require("../utils/db");
const pterodactyl_service_1 = require("../services/pterodactyl.service");
class ServerController {
    static async createServer(req, res) {
        try {
            const userId = req.user.id;
            const { name, ramGB } = req.body;
            if (!name || !ramGB) {
                return res.status(400).json({ error: 'Name and ramGB are required' });
            }
            // Validate RAM and set cost
            let costPerHour = 0;
            if (ramGB === 2)
                costPerHour = 1.5;
            else if (ramGB === 4)
                costPerHour = 3;
            else if (ramGB === 6)
                costPerHour = 6;
            else if (ramGB >= 8) {
                // Premium check
                const user = await db_1.db.user.findUnique({
                    where: { id: userId },
                    include: { premiumOrders: { where: { status: 'COMPLETED' } } }
                });
                if (!user || user.premiumOrders.length === 0) {
                    return res.status(403).json({ error: '8GB+ servers require an active Premium Order' });
                }
                // Example premium cost logic
                costPerHour = ramGB; // 8GB = 8 credits/hr, etc.
            }
            else {
                return res.status(400).json({ error: 'Invalid RAM plan' });
            }
            // Create Pterodactyl Server
            // Mocking Ptero user ID as 1 for now, in a real app you'd create a Ptero user first and store it
            const pteroData = await pterodactyl_service_1.PterodactylService.createServer(name, ramGB, 1);
            // Save in DB
            const server = await db_1.db.server.create({
                data: {
                    userId,
                    name,
                    ramGB,
                    costPerHour,
                    status: 'STOPPED',
                    pterodactylServerId: pteroData.id,
                    pterodactylIdentifier: pteroData.identifier,
                }
            });
            res.status(201).json(server);
        }
        catch (error) {
            console.error(error);
            res.status(500).json({ error: error.message });
        }
    }
    static async myServers(req, res) {
        try {
            const userId = req.user.id;
            const servers = await db_1.db.server.findMany({ where: { userId } });
            res.json(servers);
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}
exports.ServerController = ServerController;
