"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CloudflareService = void 0;
const axios_1 = __importDefault(require("axios"));
class CloudflareService {
    static get isConfigured() {
        return !!process.env.CLOUDFLARE_API_TOKEN && !!process.env.CLOUDFLARE_ZONE_ID;
    }
    static getHeaders() {
        return {
            Authorization: `Bearer ${process.env.CLOUDFLARE_API_TOKEN}`,
            'Content-Type': 'application/json',
        };
    }
    static get baseUrl() {
        return `https://api.cloudflare.com/client/v4/zones/${process.env.CLOUDFLARE_ZONE_ID}/dns_records`;
    }
    /**
     * Fetch an existing DNS record by exact name and type.
     */
    static async getRecord(name, type) {
        const url = `${this.baseUrl}?name=${name}&type=${type}`;
        const response = await axios_1.default.get(url, { headers: this.getHeaders() });
        const records = response.data.result;
        if (records && records.length > 0) {
            return records[0];
        }
        return null;
    }
    /**
     * Create or update a DNS record
     */
    static async createOrUpdateRecord(type, name, content, data, proxied = false) {
        const existing = await this.getRecord(name, type);
        const payload = { type, name, proxied };
        if (content)
            payload.content = content;
        if (data)
            payload.data = data;
        if (existing) {
            // Update
            const url = `${this.baseUrl}/${existing.id}`;
            const res = await axios_1.default.put(url, payload, { headers: this.getHeaders() });
            return res.data.result;
        }
        else {
            // Create
            const res = await axios_1.default.post(this.baseUrl, payload, { headers: this.getHeaders() });
            return res.data.result;
        }
    }
    /**
     * Provision the SRV and A records for a Minecraft server.
     */
    static async createMinecraftSubdomain(subdomain, ip, port) {
        if (!this.isConfigured) {
            throw new Error('Cloudflare DNS is not configured.');
        }
        const domain = 'freebucks.host'; // Base domain
        const aRecordName = `${subdomain}.${domain}`;
        const srvRecordName = `_minecraft._tcp.${subdomain}.${domain}`;
        console.log(`[Cloudflare] Provisioning subdomain: ${subdomain}`);
        console.log(`[Cloudflare] Node IP: ${ip}, Port: ${port}`);
        try {
            // 1. Create A Record (subdomain.freebucks.host -> Node IP)
            // Must NOT be proxied for Minecraft to connect directly.
            const aResult = await this.createOrUpdateRecord('A', aRecordName, ip, undefined, false);
            console.log(`[Cloudflare] A Record Success: ${aRecordName} -> ${ip}`);
            // 2. Create SRV Record (_minecraft._tcp.subdomain.freebucks.host -> port + target)
            const srvData = {
                service: '_minecraft',
                proto: '_tcp',
                name: subdomain, // Cloudflare API data.name takes the short name for the host part
                priority: 0,
                weight: 0,
                port: port,
                target: aRecordName,
            };
            const srvResult = await this.createOrUpdateRecord('SRV', srvRecordName, undefined, srvData, false);
            console.log(`[Cloudflare] SRV Record Success: ${srvRecordName} -> ${aRecordName}:${port}`);
            return { success: true, aResult, srvResult };
        }
        catch (err) {
            console.error('[Cloudflare] DNS Provisioning Error:', err.response?.data || err.message);
            throw new Error(err.response?.data?.errors?.[0]?.message ||
                err.message ||
                'Failed to provision DNS records in Cloudflare');
        }
    }
}
exports.CloudflareService = CloudflareService;
