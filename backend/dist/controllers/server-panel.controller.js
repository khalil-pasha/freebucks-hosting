"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServerPanelController = void 0;
const db_1 = require("../utils/db");
const pterodactyl_service_1 = require("../services/pterodactyl.service");
const cloudflare_service_1 = require("../services/cloudflare.service");
const logActivity = async (serverId, userId, action, ipAddress, details = null) => {
    await db_1.db.serverActivityLog.create({
        data: { serverId, userId, action, ipAddress, details }
    });
};
class ServerPanelController {
    static async getStatus(req, res) {
        const server = req.server;
        if (!server.pterodactylIdentifier)
            return res.json({ currentState: 'OFFLINE', usage: { cpu: 0, memory_bytes: 0, disk_bytes: 0, uptime: 0 } });
        try {
            const pteroStats = await pterodactyl_service_1.PterodactylService.getServerStatus(server.pterodactylIdentifier);
            console.log(`[Status Debug] Raw Pterodactyl API response for ${server.pterodactylIdentifier}:`, JSON.stringify(pteroStats));
            const stateMap = {
                'running': 'ONLINE',
                'offline': 'OFFLINE',
                'starting': 'STARTING',
                'stopping': 'STOPPING'
            };
            const mappedState = stateMap[pteroStats.current_state] || pteroStats.current_state?.toUpperCase() || 'OFFLINE';
            const finalResponse = {
                currentState: mappedState,
                isSuspended: pteroStats.is_suspended,
                usage: {
                    cpu: pteroStats.resources?.cpu_absolute || 0,
                    memory_bytes: pteroStats.resources?.memory_bytes || 0,
                    disk_bytes: pteroStats.resources?.disk_bytes || 0,
                    network_rx_bytes: pteroStats.resources?.network_rx_bytes || 0,
                    network_tx_bytes: pteroStats.resources?.network_tx_bytes || 0,
                    uptime: pteroStats.resources?.uptime || 0
                }
            };
            console.log(`[Status Debug] Final JSON returned to frontend for ${server.pterodactylIdentifier}:`, JSON.stringify(finalResponse));
            // Synchronize database status
            const dbStateMap = {
                'running': 'RUNNING',
                'offline': 'STOPPED',
                'starting': 'STARTING',
                'stopping': 'STOPPING'
            };
            const mappedDbState = dbStateMap[pteroStats.current_state] || 'STOPPED';
            if (server.status !== mappedDbState) {
                await db_1.db.server.update({ where: { id: server.id }, data: { status: mappedDbState } });
            }
            res.json(finalResponse);
        }
        catch (err) {
            console.error(`[Status Debug] Error fetching status for ${server.pterodactylIdentifier}:`, err.message);
            res.json({ currentState: 'OFFLINE', usage: { cpu: 0, memory_bytes: 0, disk_bytes: 0, uptime: 0 } });
        }
    }
    static async getWebsocket(req, res) {
        const server = req.server;
        console.log(`[Websocket] Fetching credentials for FreeBucks DB Server ID: ${server.id}, Pterodactyl Identifier: ${server.pterodactylIdentifier}`);
        if (!server.pterodactylIdentifier) {
            return res.status(400).json({ error: 'Server is still provisioning. Please wait.' });
        }
        try {
            const creds = await pterodactyl_service_1.PterodactylService.getWebsocketCredentials(server.pterodactylIdentifier);
            res.json(creds);
        }
        catch (err) {
            console.error(`[Websocket] Failed to fetch credentials for server ${server.id} (Ptero: ${server.pterodactylIdentifier}):`, err.message);
            if (err.response) {
                console.error(`[Websocket] Pterodactyl Response Status:`, err.response.status);
                console.error(`[Websocket] Pterodactyl Response Body:`, JSON.stringify(err.response.data));
                return res.status(err.response.status).json({ error: `Pterodactyl error: ${err.response.data?.errors?.[0]?.detail || 'Unknown Pterodactyl Error'}` });
            }
            return res.status(502).json({ error: 'Failed to connect to game panel daemon. Daemon might be offline.' });
        }
    }
    static async powerAction(req, res) {
        const server = req.server;
        const { action } = req.body; // start, stop, restart, kill
        if (!server.pterodactylIdentifier)
            return res.status(400).json({ error: 'Not provisioned' });
        console.log(`[POWER] ${action.toUpperCase()} requested for server ${server.id}`);
        if (action === 'start' || action === 'restart') {
            const owner = await db_1.db.user.findUnique({ where: { id: server.userId } });
            const hourlyCost = server.costPerHour;
            console.log(`[POWER] User balance checked for server ${server.id}: ${owner?.balance}`);
            if (!owner || owner.balance < hourlyCost) {
                console.log(`[CREDITS] Insufficient balance blocked start/restart`);
                return res.status(400).json({ error: `Insufficient credits. You need at least ${hourlyCost} credits to start/restart this server.` });
            }
        }
        console.log(`[POWER] Power action ${action} sent to Pterodactyl for server ${server.id}`);
        if (action === 'start')
            await pterodactyl_service_1.PterodactylService.startServer(server.pterodactylIdentifier);
        else if (action === 'stop')
            await pterodactyl_service_1.PterodactylService.powerServer(server.pterodactylIdentifier, 'stop');
        else if (action === 'kill')
            await pterodactyl_service_1.PterodactylService.powerServer(server.pterodactylIdentifier, 'kill');
        else if (action === 'restart')
            await pterodactyl_service_1.PterodactylService.powerServer(server.pterodactylIdentifier, 'restart');
        if (action === 'start' || action === 'restart') {
            const hourlyCost = server.costPerHour;
            if (hourlyCost > 0) {
                await db_1.db.$transaction(async (tx) => {
                    await tx.user.update({
                        where: { id: server.userId },
                        data: { balance: { decrement: hourlyCost } }
                    });
                    await tx.creditsTransaction.create({
                        data: {
                            userId: server.userId,
                            amount: hourlyCost,
                            type: 'SPENT',
                            source: action === 'start' ? 'SERVER_START' : 'SERVER_RESTART'
                        }
                    });
                    await tx.serverBillingLog.create({
                        data: {
                            serverId: server.id,
                            amountDeducted: hourlyCost,
                            reason: action === 'start' ? 'UPFRONT_START_DEDUCTION' : 'UPFRONT_RESTART_DEDUCTION'
                        }
                    });
                });
                console.log(`[CREDITS] Deducted upfront power cost (${hourlyCost}) for server ${server.id}`);
            }
        }
        await logActivity(server.id, req.user.id, `power.${action}`, req.ip || null);
        res.json({ success: true });
    }
    static async sendCommand(req, res) {
        const server = req.server;
        const { command } = req.body;
        if (!server.pterodactylIdentifier)
            return res.status(400).json({ error: 'Not provisioned' });
        await pterodactyl_service_1.PterodactylService.sendCommand(server.pterodactylIdentifier, command);
        await logActivity(server.id, req.user.id, 'command.sent', req.ip || null, `Sent command: ${command.substring(0, 20)}...`);
        res.json({ success: true });
    }
    // --- Files ---
    static async listFiles(req, res) {
        const server = req.server;
        const directory = req.query.directory || '/';
        if (!server.pterodactylIdentifier)
            return res.json([]);
        const files = await pterodactyl_service_1.PterodactylService.listFiles(server.pterodactylIdentifier, directory);
        const mappedFiles = files.map((f) => ({
            name: f.name,
            mode: f.mode,
            isFile: f.is_file,
            size: f.size,
            modifiedAt: f.modified_at
        }));
        res.json(mappedFiles);
    }
    static async getFileContent(req, res) {
        const server = req.server;
        const file = req.query.file;
        if (!server.pterodactylIdentifier)
            return res.json({ content: '' });
        const content = await pterodactyl_service_1.PterodactylService.getFileContent(server.pterodactylIdentifier, file);
        res.json({ content });
    }
    static async saveFileContent(req, res) {
        const server = req.server;
        const { file, content } = req.body;
        if (!server.pterodactylIdentifier)
            return res.status(400).json({ error: 'Not provisioned' });
        // Check size limit (e.g. 2MB)
        if (Buffer.byteLength(content, 'utf8') > 2 * 1024 * 1024) {
            return res.status(400).json({ error: 'File size exceeds 2MB limit for editor.' });
        }
        await pterodactyl_service_1.PterodactylService.saveFileContent(server.pterodactylIdentifier, file, content);
        await logActivity(server.id, req.user.id, 'file.edit', req.ip || null, file);
        res.json({ success: true });
    }
    static async renameFiles(req, res) {
        const server = req.server;
        const { root, files } = req.body;
        if (!server.pterodactylIdentifier)
            return res.status(400).json({ error: 'Not provisioned' });
        await pterodactyl_service_1.PterodactylService.renameFiles(server.pterodactylIdentifier, root, files);
        await logActivity(server.id, req.user.id, 'file.rename', req.ip || null, `Renamed/moved ${files.length} items in ${root}`);
        res.json({ success: true });
    }
    static async chmodFiles(req, res) {
        const server = req.server;
        const { root, files } = req.body;
        if (!server.pterodactylIdentifier)
            return res.status(400).json({ error: 'Not provisioned' });
        await pterodactyl_service_1.PterodactylService.chmodFiles(server.pterodactylIdentifier, root, files);
        await logActivity(server.id, req.user.id, 'file.chmod', req.ip || null, `Changed permissions for ${files.length} items in ${root}`);
        res.json({ success: true });
    }
    static async compressFiles(req, res) {
        const server = req.server;
        const { root, files } = req.body;
        if (!server.pterodactylIdentifier)
            return res.status(400).json({ error: 'Not provisioned' });
        await pterodactyl_service_1.PterodactylService.compressFiles(server.pterodactylIdentifier, root, files);
        await logActivity(server.id, req.user.id, 'file.archive', req.ip || null, `Archived ${files.length} items in ${root}`);
        res.json({ success: true });
    }
    static async decompressFile(req, res) {
        const server = req.server;
        const { root, file } = req.body;
        if (!server.pterodactylIdentifier)
            return res.status(400).json({ error: 'Not provisioned' });
        await pterodactyl_service_1.PterodactylService.decompressFile(server.pterodactylIdentifier, root, file);
        await logActivity(server.id, req.user.id, 'file.unarchive', req.ip || null, `Extracted ${file} in ${root}`);
        res.json({ success: true });
    }
    static async createFolder(req, res) {
        const server = req.server;
        const { root, name } = req.body;
        if (!server.pterodactylIdentifier)
            return res.status(400).json({ error: 'Not provisioned' });
        await pterodactyl_service_1.PterodactylService.createFolder(server.pterodactylIdentifier, root, name);
        await logActivity(server.id, req.user.id, 'folder.create', req.ip || null, `${root}/${name}`);
        res.json({ success: true });
    }
    static async deleteFiles(req, res) {
        const server = req.server;
        const { root, files } = req.body;
        if (!server.pterodactylIdentifier)
            return res.status(400).json({ error: 'Not provisioned' });
        await pterodactyl_service_1.PterodactylService.deleteFiles(server.pterodactylIdentifier, root, files);
        await logActivity(server.id, req.user.id, 'file.delete', req.ip || null, `Deleted ${files.length} items in ${root}`);
        res.json({ success: true });
    }
    static async getUploadUrl(req, res) {
        const server = req.server;
        if (!server.pterodactylIdentifier)
            return res.status(400).json({ error: 'Not provisioned' });
        const url = await pterodactyl_service_1.PterodactylService.getUploadUrl(server.pterodactylIdentifier);
        res.json({ url });
    }
    // PLUGINS
    static async listPlugins(req, res) {
        const server = req.server;
        if (!server.pterodactylIdentifier)
            return res.status(400).json({ error: 'Not provisioned' });
        try {
            const files = await pterodactyl_service_1.PterodactylService.listFiles(server.pterodactylIdentifier, '/plugins');
            const mappedFiles = files
                .filter((f) => f.is_file && f.name.endsWith('.jar'))
                .map((f) => ({
                name: f.name,
                size: f.size,
                modifiedAt: f.modified_at
            }));
            res.json(mappedFiles);
        }
        catch (err) {
            if (err.response && err.response.status === 404) {
                return res.status(404).json({ error: 'Plugins are available only for Paper/Spigot/Bukkit servers.' });
            }
            res.status(400).json({ error: err.message });
        }
    }
    static async deletePlugin(req, res) {
        const server = req.server;
        const { file } = req.body;
        if (!server.pterodactylIdentifier)
            return res.status(400).json({ error: 'Not provisioned' });
        if (!file || !file.endsWith('.jar'))
            return res.status(400).json({ error: 'Invalid plugin file' });
        await pterodactyl_service_1.PterodactylService.deleteFiles(server.pterodactylIdentifier, '/plugins', [file]);
        await logActivity(server.id, req.user.id, 'plugin.delete', req.ip || null, `Deleted plugin ${file}`);
        res.json({ success: true });
    }
    static async renamePlugin(req, res) {
        const server = req.server;
        const { file, newName } = req.body;
        if (!server.pterodactylIdentifier)
            return res.status(400).json({ error: 'Not provisioned' });
        if (!file || !file.endsWith('.jar'))
            return res.status(400).json({ error: 'Invalid source plugin file' });
        if (!newName || !newName.endsWith('.jar'))
            return res.status(400).json({ error: 'New name must end with .jar' });
        await pterodactyl_service_1.PterodactylService.renameFiles(server.pterodactylIdentifier, '/plugins', [{ from: file, to: newName }]);
        await logActivity(server.id, req.user.id, 'plugin.rename', req.ip || null, `Renamed plugin ${file} to ${newName}`);
        res.json({ success: true });
    }
    static async installPluginUrl(req, res) {
        const server = req.server;
        const { url } = req.body;
        if (!server.pterodactylIdentifier)
            return res.status(400).json({ error: 'Not provisioned' });
        try {
            const parsedUrl = new URL(url);
            if (parsedUrl.protocol !== 'http:' && parsedUrl.protocol !== 'https:') {
                return res.status(400).json({ error: 'Invalid URL protocol' });
            }
            const lookup = await require('dns').promises.lookup(parsedUrl.hostname, { family: 4 });
            const ip = lookup.address;
            if (parsedUrl.hostname === 'localhost' || !ip) {
                return res.status(400).json({ error: 'Invalid hostname' });
            }
            const parts = ip.split('.').map(Number);
            let isPrivate = false;
            if (parts[0] === 10)
                isPrivate = true;
            if (parts[0] === 127)
                isPrivate = true;
            if (parts[0] === 172 && parts[1] >= 16 && parts[1] <= 31)
                isPrivate = true;
            if (parts[0] === 192 && parts[1] === 168)
                isPrivate = true;
            if (parts[0] === 169 && parts[1] === 254)
                isPrivate = true;
            if (parts[0] === 0)
                isPrivate = true;
            if (isPrivate) {
                return res.status(400).json({ error: 'Cannot download from private IP addresses' });
            }
            let filename = parsedUrl.pathname.split('/').pop() || 'plugin.jar';
            if (!filename.endsWith('.jar')) {
                filename += '.jar';
            }
            const axios = require('axios');
            const axiosRes = await axios.get(url, {
                responseType: 'arraybuffer',
                maxRedirects: 0,
                maxContentLength: 50 * 1024 * 1024,
                timeout: 30000
            });
            const buffer = axiosRes.data;
            const uploadUrl = await pterodactyl_service_1.PterodactylService.getUploadUrl(server.pterodactylIdentifier);
            const FormData = require('form-data');
            const form = new FormData();
            form.append('files', buffer, filename);
            await axios.post(`${uploadUrl}&directory=/plugins`, form, {
                headers: form.getHeaders(),
                maxBodyLength: 50 * 1024 * 1024,
            });
            await logActivity(server.id, req.user.id, 'plugin.install', req.ip || null, `Installed plugin ${filename} from URL`);
            res.json({ success: true });
        }
        catch (err) {
            if (err.response && [301, 302, 307, 308].includes(err.response.status)) {
                return res.status(400).json({ error: 'Redirects are not allowed for security reasons' });
            }
            res.status(400).json({ error: 'Failed to download or upload plugin: ' + err.message });
        }
    }
    static async getDownloadUrl(req, res) {
        const server = req.server;
        const file = req.query.file;
        if (!server.pterodactylIdentifier)
            return res.status(400).json({ error: 'Not provisioned' });
        const url = await pterodactyl_service_1.PterodactylService.getDownloadUrl(server.pterodactylIdentifier, file);
        res.json({ url });
    }
    // --- Users (Server Access) ---
    static async listUsers(req, res) {
        const serverId = req.params.id;
        const server = req.server;
        const accesses = await db_1.db.serverAccess.findMany({
            where: { serverId },
            include: {
                user: { select: { id: true, username: true, email: true, avatar: true } }
            }
        });
        const invites = await db_1.db.serverInvite.findMany({
            where: { serverId, status: 'PENDING' }
        });
        res.json({ accesses, invites });
    }
    static async inviteUser(req, res) {
        const serverId = req.params.id;
        const { emailOrDiscord, permissions } = req.body;
        if (!emailOrDiscord || !emailOrDiscord.trim()) {
            return res.status(400).json({ error: 'Email or Discord ID is required' });
        }
        const server = req.server;
        if (server.userId !== req.user.id) {
            return res.status(403).json({ error: 'Only the server owner can invite users.' });
        }
        const isEmail = emailOrDiscord.includes('@');
        const email = isEmail ? emailOrDiscord.trim().toLowerCase() : null;
        const discordId = !isEmail ? emailOrDiscord.trim() : null;
        // Check if user is trying to invite themselves
        const reqUser = req.user;
        if ((email && reqUser.email?.toLowerCase() === email) || (discordId && reqUser.discordId === discordId)) {
            return res.status(400).json({ error: 'Cannot invite yourself' });
        }
        // Check if the user already has access
        const existingUser = await db_1.db.user.findFirst({
            where: {
                OR: [
                    ...(email ? [{ email }] : []),
                    ...(discordId ? [{ discordId }] : [])
                ]
            }
        });
        if (existingUser) {
            const existingAccess = await db_1.db.serverAccess.findUnique({
                where: { serverId_userId: { serverId, userId: existingUser.id } }
            });
            if (existingAccess) {
                return res.status(400).json({ error: 'User already has access to this server.' });
            }
        }
        // Check for duplicate pending invites
        const duplicateInvite = await db_1.db.serverInvite.findFirst({
            where: {
                serverId,
                status: 'PENDING',
                OR: [
                    ...(email ? [{ email }] : []),
                    ...(discordId ? [{ discordId }] : [])
                ]
            }
        });
        if (duplicateInvite) {
            return res.status(400).json({ error: 'Invite already pending.' });
        }
        const invite = await db_1.db.serverInvite.create({
            data: {
                serverId,
                email,
                discordId,
                permissions: JSON.stringify(permissions)
            }
        });
        await logActivity(serverId, req.user.id, 'user.invite', req.ip || null, emailOrDiscord);
        res.json(invite);
    }
    static async removeUser(req, res) {
        const serverId = req.params.id;
        const accessId = req.params.accessId;
        const server = req.server;
        if (server.userId !== req.user.id) {
            return res.status(403).json({ error: 'Only the server owner can remove users.' });
        }
        await db_1.db.serverAccess.delete({ where: { id: accessId } });
        await logActivity(serverId, req.user.id, 'user.remove', req.ip || null, accessId);
        res.json({ success: true });
    }
    static async cancelInvite(req, res) {
        const serverId = req.params.id;
        const inviteId = req.params.inviteId;
        const server = req.server;
        if (server.userId !== req.user.id) {
            return res.status(403).json({ error: 'Only the server owner can cancel invites.' });
        }
        await db_1.db.serverInvite.delete({ where: { id: inviteId } });
        await logActivity(serverId, req.user.id, 'invite.cancel', req.ip || null, inviteId);
        res.json({ success: true });
    }
    // User-facing invite methods (not bound to server middleware)
    static async listUserInvites(req, res) {
        const user = await db_1.db.user.findUnique({ where: { id: req.user.id } });
        if (!user)
            return res.status(404).json({ error: 'User not found' });
        console.log('[DEBUG INVITE] Current logged-in user:', { id: user.id, email: user.email, discordId: user.discordId });
        const orConditions = [
            ...(user.email ? [{ email: user.email.toLowerCase() }] : []),
            ...(user.discordId ? [{ discordId: user.discordId }] : [])
        ];
        if (orConditions.length === 0) {
            return res.json([]);
        }
        console.log('[DEBUG INVITE] Query OR conditions:', orConditions);
        const invites = await db_1.db.serverInvite.findMany({
            where: {
                status: 'PENDING',
                OR: orConditions.length > 0 ? orConditions : undefined
            },
            include: {
                server: { select: { id: true, name: true, user: { select: { username: true } } } }
            }
        });
        console.log('[DEBUG INVITE] Found invites count:', invites.length);
        console.log('[DEBUG INVITE] Latest pending invites in DB:', await db_1.db.serverInvite.findMany({ where: { status: 'PENDING' }, take: 5 }));
        res.json(invites);
    }
    static async acceptInvite(req, res) {
        const inviteId = req.params.inviteId;
        const user = await db_1.db.user.findUnique({ where: { id: req.user.id } });
        if (!user)
            return res.status(404).json({ error: 'User not found' });
        const orConditions = [
            ...(user.email ? [{ email: user.email.toLowerCase() }] : []),
            ...(user.discordId ? [{ discordId: user.discordId }] : [])
        ];
        if (orConditions.length === 0) {
            return res.status(404).json({ error: 'Invite not found or already processed' });
        }
        const invite = await db_1.db.serverInvite.findFirst({
            where: {
                id: inviteId,
                status: 'PENDING',
                OR: orConditions
            }
        });
        if (!invite)
            return res.status(404).json({ error: 'Invite not found or already processed' });
        await db_1.db.$transaction([
            db_1.db.serverInvite.update({ where: { id: invite.id }, data: { status: 'ACCEPTED' } }),
            db_1.db.serverAccess.upsert({
                where: { serverId_userId: { serverId: invite.serverId, userId: user.id } },
                update: { permissions: invite.permissions },
                create: { serverId: invite.serverId, userId: user.id, permissions: invite.permissions }
            })
        ]);
        await logActivity(invite.serverId, req.user.id, 'invite.accept', req.ip || null, user.username);
        res.json({ success: true });
    }
    static async declineInvite(req, res) {
        const inviteId = req.params.inviteId;
        const user = await db_1.db.user.findUnique({ where: { id: req.user.id } });
        if (!user)
            return res.status(404).json({ error: 'User not found' });
        const orConditions = [
            ...(user.email ? [{ email: user.email.toLowerCase() }] : []),
            ...(user.discordId ? [{ discordId: user.discordId }] : [])
        ];
        if (orConditions.length === 0) {
            return res.status(404).json({ error: 'Invite not found or already processed' });
        }
        const invite = await db_1.db.serverInvite.findFirst({
            where: {
                id: inviteId,
                status: 'PENDING',
                OR: orConditions
            }
        });
        if (!invite)
            return res.status(404).json({ error: 'Invite not found or already processed' });
        await db_1.db.serverInvite.update({ where: { id: invite.id }, data: { status: 'DECLINED' } });
        res.json({ success: true });
    }
    // --- Subdomain ---
    static async getSubdomain(req, res) {
        const serverId = req.params.id;
        let sub = await db_1.db.serverSubdomain.findUnique({ where: { serverId } });
        if (sub && (sub.status === 'Pending DNS Provisioning' || sub.status === 'PENDING' || sub.status.startsWith('FAILED'))) {
            try {
                const { promises: dns } = require('dns');
                const domain = `${sub.subdomain}.freebucks.host`;
                const srvDomain = `_minecraft._tcp.${domain}`;
                let aExists = false;
                let srvExists = false;
                const aRecords = await dns.resolve4(domain).catch(() => []);
                if (aRecords.length > 0) {
                    console.log(`[SUBDOMAIN] A record exists/created`);
                    aExists = true;
                }
                const srvRecords = await dns.resolveSrv(srvDomain).catch(() => []);
                if (srvRecords.length > 0) {
                    console.log(`[SUBDOMAIN] SRV record exists/created`);
                    srvExists = true;
                }
                if (aExists && srvExists) {
                    if (sub.status !== 'ACTIVE') {
                        sub = await db_1.db.serverSubdomain.update({
                            where: { serverId },
                            data: { status: 'ACTIVE' }
                        });
                        console.log(`[SUBDOMAIN] status updated to ACTIVE`);
                    }
                }
                else {
                    console.log(`[CF] Auto-provisioning missing DNS records for ${sub.subdomain}`);
                    const server = await db_1.db.server.findUnique({ where: { id: serverId } });
                    if (server && server.pterodactylIdentifier) {
                        const allocation = await pterodactyl_service_1.PterodactylService.getServerAllocation(server.pterodactylIdentifier);
                        if (allocation && allocation.ip && allocation.port) {
                            console.log(`[CF] generateSubdomain entered (auto-provision)`);
                            await cloudflare_service_1.CloudflareService.createMinecraftSubdomain(sub.subdomain, allocation.ip, allocation.port);
                            sub = await db_1.db.serverSubdomain.update({
                                where: { serverId },
                                data: { status: 'ACTIVE' }
                            });
                            console.log(`[CF] database updated`);
                            console.log(`[SUBDOMAIN] status updated to ACTIVE`);
                        }
                        else {
                            console.log(`[CF] Auto-provision failed: No allocation details`);
                        }
                    }
                }
            }
            catch (err) {
                console.error('[SUBDOMAIN] DNS check or auto-provision failed', err);
                sub = await db_1.db.serverSubdomain.update({
                    where: { serverId },
                    data: { status: `FAILED: ${err.message}` }
                });
            }
        }
        res.json(sub);
    }
    static async generateSubdomain(req, res) {
        const serverId = req.params.id;
        const { requestedSubdomain } = req.body;
        const regex = /^[a-z0-9]+$/;
        if (!regex.test(requestedSubdomain))
            return res.status(400).json({ error: 'Invalid subdomain format' });
        // Check uniqueness
        const exists = await db_1.db.serverSubdomain.findUnique({ where: { subdomain: requestedSubdomain } });
        if (exists && exists.serverId !== serverId) {
            return res.status(400).json({ error: 'Subdomain already taken' });
        }
        const server = await db_1.db.server.findUnique({ where: { id: serverId } });
        if (!server)
            return res.status(404).json({ error: 'Server not found' });
        try {
            const allocation = await pterodactyl_service_1.PterodactylService.getServerAllocation(server.pterodactylIdentifier);
            if (!allocation || !allocation.ip || !allocation.port) {
                return res.status(400).json({ error: 'Could not fetch server allocation details.' });
            }
            console.log(`[CF] generateSubdomain entered`);
            // Provision via Cloudflare
            await cloudflare_service_1.CloudflareService.createMinecraftSubdomain(requestedSubdomain, allocation.ip, allocation.port);
            console.log(`[SUBDOMAIN] A record exists/created`);
            console.log(`[SUBDOMAIN] SRV record exists/created`);
            const sub = await db_1.db.serverSubdomain.upsert({
                where: { serverId },
                update: { subdomain: requestedSubdomain, status: 'ACTIVE' },
                create: { serverId, subdomain: requestedSubdomain, status: 'ACTIVE' }
            });
            console.log(`[CF] database updated`);
            console.log(`[SUBDOMAIN] status updated to ACTIVE`);
            await logActivity(serverId, req.user.id, 'subdomain.update', req.ip || null, requestedSubdomain);
            res.json(sub);
        }
        catch (err) {
            console.error('[Subdomain Generation Error]', err);
            // Fallback or explicit failure
            await db_1.db.serverSubdomain.upsert({
                where: { serverId },
                update: { subdomain: requestedSubdomain, status: `FAILED: ${err.message}` },
                create: { serverId, subdomain: requestedSubdomain, status: `FAILED: ${err.message}` }
            });
            return res.status(400).json({ error: err.message || 'Failed to provision subdomain.' });
        }
    }
    // --- Activity ---
    static async getActivity(req, res) {
        const serverId = req.params.id;
        const logs = await db_1.db.serverActivityLog.findMany({
            where: { serverId },
            orderBy: { createdAt: 'desc' },
            take: 100,
            include: { user: { select: { id: true, username: true } } }
        });
        res.json(logs);
    }
    // --- Settings ---
    static async updateSettings(req, res) {
        const serverId = req.params.id;
        const { name } = req.body;
        await db_1.db.server.update({ where: { id: serverId }, data: { name } });
        await logActivity(serverId, req.user.id, 'settings.update', req.ip || null, `Renamed to ${name}`);
        res.json({ success: true });
    }
    static async reinstallServer(req, res) {
        const server = req.server;
        if (!server.pterodactylIdentifier)
            return res.status(400).json({ error: 'Not provisioned' });
        await pterodactyl_service_1.PterodactylService.reinstallServer(server.pterodactylIdentifier);
        await logActivity(server.id, req.user.id, 'server.reinstall', req.ip || null, 'Triggered reinstallation');
        res.json({ success: true });
    }
    // --- Startup ---
    static async getStartup(req, res) {
        const server = req.server;
        if (!server.pterodactylIdentifier)
            return res.json({ variables: [], dockerImage: null });
        const vars = await pterodactyl_service_1.PterodactylService.getStartupVariables(server.pterodactylIdentifier);
        let dockerImage = null;
        if (server.pterodactylServerId) {
            dockerImage = await pterodactyl_service_1.PterodactylService.getServerDockerImage(server.pterodactylServerId);
        }
        res.json({ variables: vars, dockerImage });
    }
    static async acceptEula(req, res) {
        const server = req.server;
        if (!server.pterodactylIdentifier)
            return res.status(400).json({ error: 'Server is not provisioned.' });
        try {
            const stateBefore = await pterodactyl_service_1.PterodactylService.getServerStatus(server.pterodactylIdentifier);
            console.log(`[EULA] Server state BEFORE accept:`, stateBefore.current_state);
            await pterodactyl_service_1.PterodactylService.acceptEula(server.pterodactylIdentifier);
            const eulaContent = await pterodactyl_service_1.PterodactylService.getFileContent(server.pterodactylIdentifier, '/eula.txt').catch(() => 'Failed to read eula.txt');
            console.log(`[EULA] eula.txt contents verified:\n${eulaContent}`);
            // Force a restart to ensure Wings clears crash state and Pterodactyl UI sees the restart
            await pterodactyl_service_1.PterodactylService.powerServer(server.pterodactylIdentifier, 'restart');
            const stateAfter = await pterodactyl_service_1.PterodactylService.getServerStatus(server.pterodactylIdentifier);
            console.log(`[EULA] Server state AFTER restart signal:`, stateAfter.current_state);
            await logActivity(server.id, req.user.id, 'EULA_ACCEPTED', req.ip || null, 'Accepted Minecraft EULA');
            res.json({ success: true });
        }
        catch (error) {
            console.error('[EULA Accept Error]', error.response?.data || error.message);
            res.status(500).json({ error: 'Failed to accept EULA. Please try again or accept manually in the Files tab.' });
        }
    }
    static async updateDockerImage(req, res) {
        const server = req.server;
        const { dockerImage } = req.body;
        if (!server.pterodactylIdentifier)
            return res.status(400).json({ error: 'Not provisioned' });
        if (!dockerImage)
            return res.status(400).json({ error: 'Missing dockerImage' });
        await pterodactyl_service_1.PterodactylService.updateDockerImage(server.pterodactylIdentifier, dockerImage);
        await logActivity(server.id, req.user.id, 'startup.update', req.ip || null, `Updated Docker Image to ${dockerImage}`);
        res.json({ success: true });
    }
    static async updateStartup(req, res) {
        const server = req.server;
        const { key, value } = req.body;
        if (!server.pterodactylIdentifier)
            return res.status(400).json({ error: 'Not provisioned' });
        await pterodactyl_service_1.PterodactylService.updateStartupVariable(server.pterodactylIdentifier, key, value);
        await logActivity(server.id, req.user.id, 'startup.update', req.ip || null, `Updated ${key}`);
        res.json({ success: true });
    }
}
exports.ServerPanelController = ServerPanelController;
