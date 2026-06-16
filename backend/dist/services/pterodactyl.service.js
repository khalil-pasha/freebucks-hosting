"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PterodactylService = void 0;
const axios_1 = __importDefault(require("axios"));
class PterodactylService {
    static isAppConfigured() {
        return !!(process.env.PTERODACTYL_PANEL_URL && process.env.PTERODACTYL_API_KEY);
    }
    static isClientConfigured() {
        return !!(process.env.PTERODACTYL_PANEL_URL && process.env.PTERODACTYL_CLIENT_KEY);
    }
    static getAppHeaders() {
        return {
            'Authorization': `Bearer ${process.env.PTERODACTYL_API_KEY}`,
            'Accept': 'Application/vnd.pterodactyl.v1+json',
            'Content-Type': 'application/json',
        };
    }
    static getClientHeaders() {
        return {
            'Authorization': `Bearer ${process.env.PTERODACTYL_CLIENT_KEY}`,
            'Accept': 'Application/vnd.pterodactyl.v1+json',
            'Content-Type': 'application/json',
        };
    }
    static async createUser(email, username, first_name, last_name, password) {
        if (!this.isAppConfigured()) {
            throw new Error('Pterodactyl Application API is not configured');
        }
        const url = `${process.env.PTERODACTYL_PANEL_URL}/api/application/users`;
        const data = {
            email,
            username,
            first_name,
            last_name,
            password: password || undefined
        };
        const response = await axios_1.default.post(url, data, { headers: this.getAppHeaders() });
        return response.data.attributes.id;
    }
    static async updateUserPassword(pteroUserId, email, username, first_name, last_name, password) {
        if (!this.isAppConfigured()) {
            throw new Error('Pterodactyl Application API is not configured');
        }
        const url = `${process.env.PTERODACTYL_PANEL_URL}/api/application/users/${pteroUserId}`;
        const data = {
            email,
            username,
            first_name,
            last_name,
            password: password || undefined
        };
        await axios_1.default.patch(url, data, { headers: this.getAppHeaders() });
        return true;
    }
    static async createServer(name, ramGB, cpu, disk, pteroUserId) {
        if (!this.isAppConfigured()) {
            throw new Error('Pterodactyl Application API is not configured');
        }
        const url = `${process.env.PTERODACTYL_PANEL_URL}/api/application/servers`;
        const data = {
            name,
            user: pteroUserId, // Ensure the Ptero user ID exists, usually linked to DB User
            egg: parseInt(process.env.PTERODACTYL_EGG_ID || '1', 10),
            docker_image: 'ghcr.io/pterodactyl/yolks:java_25',
            startup: 'java -Xms128M -Xmx{{SERVER_MEMORY}}M -jar {{SERVER_JARFILE}}',
            environment: {
                SERVER_JARFILE: 'server.jar',
                BUILD_NUMBER: 'latest',
                EULA: '1'
            },
            limits: {
                memory: ramGB * 1024,
                swap: 0,
                disk: disk * 1024,
                io: 500,
                cpu: cpu
            },
            feature_limits: {
                databases: 1,
                allocations: 1,
                backups: 1
            },
            deploy: {
                locations: [parseInt(process.env.PTERODACTYL_LOCATION_ID || '1', 10)],
                dedicated_ip: false,
                port_range: []
            }
        };
        console.log('[Pterodactyl] Sending Create Server Payload:', JSON.stringify(data, null, 2));
        try {
            const response = await axios_1.default.post(url, data, { headers: this.getAppHeaders() });
            return {
                id: response.data.attributes.id,
                identifier: response.data.attributes.identifier,
            };
        }
        catch (err) {
            console.error('[Pterodactyl] Create Server Error. Status:', err.response?.status);
            console.error('[Pterodactyl] Create Server Error Data:', JSON.stringify(err.response?.data || err.message, null, 2));
            throw err;
        }
    }
    static async updateServerBuild(serverId, ramGB, cpu, disk) {
        if (!this.isAppConfigured()) {
            throw new Error('Pterodactyl Application API is not configured');
        }
        const getUrl = `${process.env.PTERODACTYL_PANEL_URL}/api/application/servers/${serverId}`;
        const getRes = await axios_1.default.get(getUrl, { headers: this.getAppHeaders() });
        const allocationId = getRes.data.attributes.allocation;
        const patchUrl = `${process.env.PTERODACTYL_PANEL_URL}/api/application/servers/${serverId}/build`;
        const data = {
            allocation: allocationId,
            memory: ramGB * 1024,
            swap: 0,
            disk: disk * 1024,
            io: 500,
            cpu: cpu,
            threads: null,
            feature_limits: {
                databases: 1,
                allocations: 1,
                backups: 1
            }
        };
        await axios_1.default.patch(patchUrl, data, { headers: this.getAppHeaders() });
        return true;
    }
    static async getServerAllocation(identifier) {
        if (!this.isClientConfigured()) {
            throw new Error('Pterodactyl Client API is not configured');
        }
        try {
            const url = `${process.env.PTERODACTYL_PANEL_URL}/api/client/servers/${identifier}`;
            const response = await axios_1.default.get(url, { headers: this.getClientHeaders() });
            const allocs = response.data.attributes.relationships?.allocations?.data;
            if (allocs && allocs.length > 0) {
                const primary = allocs.find((a) => a.attributes.is_default) || allocs[0];
                return {
                    ip: primary.attributes.ip,
                    alias: primary.attributes.ip_alias,
                    port: primary.attributes.port
                };
            }
            return null;
        }
        catch (err) {
            console.error(`[Pterodactyl] Error fetching allocation for ${identifier}: ${err.message}`);
            return null;
        }
    }
    static async powerServer(identifier, signal) {
        if (!this.isClientConfigured()) {
            throw new Error('Pterodactyl Client API is not configured');
        }
        const url = `${process.env.PTERODACTYL_PANEL_URL}/api/client/servers/${identifier}/power`;
        await axios_1.default.post(url, { signal }, { headers: this.getClientHeaders() });
        return true;
    }
    static async startServer(identifier) {
        return this.powerServer(identifier, 'start');
    }
    static async stopServer(identifier) {
        return this.powerServer(identifier, 'kill');
    }
    static async restartServer(identifier) {
        return this.powerServer(identifier, 'restart');
    }
    static async suspendServer(serverId) {
        if (!this.isAppConfigured()) {
            throw new Error('Pterodactyl Application API is not configured');
        }
        const url = `${process.env.PTERODACTYL_PANEL_URL}/api/application/servers/${serverId}/suspend`;
        await axios_1.default.post(url, {}, { headers: this.getAppHeaders() });
        return true;
    }
    static async deleteServer(serverId) {
        if (!this.isAppConfigured()) {
            throw new Error('Pterodactyl Application API is not configured');
        }
        const url = `${process.env.PTERODACTYL_PANEL_URL}/api/application/servers/${serverId}`;
        await axios_1.default.delete(url, { headers: this.getAppHeaders() });
        return true;
    }
    static async checkConnection() {
        if (!this.isAppConfigured()) {
            return { status: 'simulation_mode', message: 'API not configured' };
        }
        try {
            const url = `${process.env.PTERODACTYL_PANEL_URL}/api/application/users`;
            await axios_1.default.get(url, { headers: this.getAppHeaders() });
            return { status: 'ok' };
        }
        catch (error) {
            console.error('Pterodactyl Check Connection Error:', error.message);
            return { status: 'error', message: error.message };
        }
    }
    // ==========================================
    // SERVER PANEL CLIENT API METHODS
    // ==========================================
    static async getServerStatus(identifier) {
        if (!this.isClientConfigured())
            throw new Error('Pterodactyl Client API is not configured');
        const url = `${process.env.PTERODACTYL_PANEL_URL}/api/client/servers/${identifier}/resources`;
        const res = await axios_1.default.get(url, { headers: this.getClientHeaders() });
        return res.data.attributes;
    }
    static async getWebsocketCredentials(identifier) {
        if (!this.isClientConfigured())
            throw new Error('Pterodactyl Client API is not configured');
        const url = `${process.env.PTERODACTYL_PANEL_URL}/api/client/servers/${identifier}/websocket`;
        const res = await axios_1.default.get(url, { headers: this.getClientHeaders() });
        return res.data.data;
    }
    static async sendCommand(identifier, command) {
        if (!this.isClientConfigured())
            throw new Error('Pterodactyl Client API is not configured');
        const url = `${process.env.PTERODACTYL_PANEL_URL}/api/client/servers/${identifier}/command`;
        await axios_1.default.post(url, { command }, { headers: this.getClientHeaders() });
    }
    static async listFiles(identifier, directory = '/') {
        if (!this.isClientConfigured())
            throw new Error('Pterodactyl Client API is not configured');
        const url = `${process.env.PTERODACTYL_PANEL_URL}/api/client/servers/${identifier}/files/list?directory=${encodeURIComponent(directory)}`;
        const res = await axios_1.default.get(url, { headers: this.getClientHeaders() });
        return res.data.data.map((f) => f.attributes);
    }
    static async getFileContent(identifier, file) {
        if (!this.isClientConfigured())
            throw new Error('Pterodactyl Client API is not configured');
        const url = `${process.env.PTERODACTYL_PANEL_URL}/api/client/servers/${identifier}/files/contents?file=${encodeURIComponent(file)}`;
        const res = await axios_1.default.get(url, { headers: this.getClientHeaders(), responseType: 'text' });
        return res.data;
    }
    static async saveFileContent(identifier, file, content) {
        if (!this.isClientConfigured())
            throw new Error('Pterodactyl Client API is not configured');
        const url = `${process.env.PTERODACTYL_PANEL_URL}/api/client/servers/${identifier}/files/write?file=${encodeURIComponent(file)}`;
        await axios_1.default.post(url, content, {
            headers: { ...this.getClientHeaders(), 'Content-Type': 'text/plain' }
        });
    }
    static async renameFiles(identifier, root, files) {
        if (!this.isClientConfigured())
            throw new Error('Pterodactyl Client API is not configured');
        const url = `${process.env.PTERODACTYL_PANEL_URL}/api/client/servers/${identifier}/files/rename`;
        await axios_1.default.put(url, { root, files }, { headers: this.getClientHeaders() });
    }
    static async createFolder(identifier, root, name) {
        if (!this.isClientConfigured())
            throw new Error('Pterodactyl Client API is not configured');
        const url = `${process.env.PTERODACTYL_PANEL_URL}/api/client/servers/${identifier}/files/create-folder`;
        await axios_1.default.post(url, { root, name }, { headers: this.getClientHeaders() });
    }
    static async deleteFiles(identifier, root, files) {
        if (!this.isClientConfigured())
            throw new Error('Pterodactyl Client API is not configured');
        const url = `${process.env.PTERODACTYL_PANEL_URL}/api/client/servers/${identifier}/files/delete`;
        await axios_1.default.post(url, { root, files }, { headers: this.getClientHeaders() });
    }
    static async getUploadUrl(identifier) {
        if (!this.isClientConfigured())
            throw new Error('Pterodactyl Client API is not configured');
        const url = `${process.env.PTERODACTYL_PANEL_URL}/api/client/servers/${identifier}/files/upload`;
        const res = await axios_1.default.get(url, { headers: this.getClientHeaders() });
        return res.data.attributes.url;
    }
    static async getDownloadUrl(identifier, file) {
        if (!this.isClientConfigured())
            throw new Error('Pterodactyl Client API is not configured');
        const url = `${process.env.PTERODACTYL_PANEL_URL}/api/client/servers/${identifier}/files/download?file=${encodeURIComponent(file)}`;
        const res = await axios_1.default.get(url, { headers: this.getClientHeaders() });
        return res.data.attributes.url;
    }
    static async getStartupVariables(identifier) {
        if (!this.isClientConfigured()) {
            throw new Error('Pterodactyl Client API is not configured');
        }
        const url = `${process.env.PTERODACTYL_PANEL_URL}/api/client/servers/${identifier}/startup`;
        const response = await axios_1.default.get(url, { headers: this.getClientHeaders() });
        return response.data.data.map((v) => v.attributes);
    }
    static async updateDockerImage(identifier, dockerImage) {
        if (!this.isClientConfigured()) {
            throw new Error('Pterodactyl Client API is not configured');
        }
        const url = `${process.env.PTERODACTYL_PANEL_URL}/api/client/servers/${identifier}/settings/docker-image`;
        await axios_1.default.put(url, { docker_image: dockerImage }, { headers: this.getClientHeaders() });
        return true;
    }
    static async getServerDockerImage(pterodactylServerId) {
        if (!this.isAppConfigured()) {
            return null;
        }
        try {
            const url = `${process.env.PTERODACTYL_PANEL_URL}/api/application/servers/${pterodactylServerId}`;
            const response = await axios_1.default.get(url, { headers: this.getAppHeaders() });
            return response.data.attributes.container.image;
        }
        catch (err) {
            console.error('[Pterodactyl] Failed to fetch server docker image:', err);
            return null;
        }
    }
    static async updateStartupVariable(identifier, key, value) {
        if (!this.isClientConfigured())
            throw new Error('Pterodactyl Client API is not configured');
        const url = `${process.env.PTERODACTYL_PANEL_URL}/api/client/servers/${identifier}/startup/variable`;
        await axios_1.default.put(url, { key, value }, { headers: this.getClientHeaders() });
    }
    static async reinstallServer(identifier) {
        if (!this.isClientConfigured())
            throw new Error('Pterodactyl Client API is not configured');
        const url = `${process.env.PTERODACTYL_PANEL_URL}/api/client/servers/${identifier}/settings/reinstall`;
        await axios_1.default.post(url, {}, { headers: this.getClientHeaders() });
    }
}
exports.PterodactylService = PterodactylService;
