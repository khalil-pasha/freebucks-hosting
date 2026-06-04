"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SettingsService = void 0;
const db_1 = require("../utils/db");
const DEFAULT_SETTINGS = [
    { key: 'dailyCreditCap', type: 'number', defaultValue: 35 },
    { key: 'hourlyClaimReward', type: 'number', defaultValue: 1.5 },
    { key: 'spinMinReward', type: 'number', defaultValue: 1 },
    { key: 'spinMaxReward', type: 'number', defaultValue: 20 },
    { key: 'referralSenderReward', type: 'number', defaultValue: 25 },
    { key: 'referralReceiverReward', type: 'number', defaultValue: 50 },
    { key: 'queueConcurrency', type: 'number', defaultValue: 5 },
    { key: 'premiumQueuePriority', type: 'number', defaultValue: 1 },
    { key: 'freeQueuePriority', type: 'number', defaultValue: 10 },
    { key: 'maintenanceMode', type: 'boolean', defaultValue: false },
];
class SettingsService {
    static cache = new Map();
    static TTL_MS = 60 * 1000; // 60 seconds
    static async initDefaultSettings() {
        for (const def of DEFAULT_SETTINGS) {
            const existing = await db_1.db.setting.findUnique({ where: { key: def.key } });
            if (!existing) {
                await db_1.db.setting.create({
                    data: {
                        key: def.key,
                        value: String(def.defaultValue),
                        description: `Default: ${def.defaultValue}`,
                    },
                });
            }
        }
    }
    static parseValue(value, type) {
        if (type === 'number')
            return Number(value);
        if (type === 'boolean')
            return value === 'true';
        return value;
    }
    static async get(key) {
        const cached = this.cache.get(key);
        if (cached && cached.expiresAt > Date.now()) {
            return cached.value;
        }
        const def = DEFAULT_SETTINGS.find(d => d.key === key);
        if (!def)
            throw new Error(`Unknown setting key: ${key}`);
        const setting = await db_1.db.setting.findUnique({ where: { key } });
        const value = setting ? this.parseValue(setting.value, def.type) : def.defaultValue;
        this.cache.set(key, { value, expiresAt: Date.now() + this.TTL_MS });
        return value;
    }
    static async getNumber(key) {
        return (await this.get(key));
    }
    static async getBoolean(key) {
        return (await this.get(key));
    }
    static async getString(key) {
        return (await this.get(key));
    }
    static async update(adminId, key, newValue) {
        const def = DEFAULT_SETTINGS.find(d => d.key === key);
        if (!def)
            throw new Error(`Unknown setting key: ${key}`);
        const strValue = String(newValue);
        // Log the change
        const existing = await db_1.db.setting.findUnique({ where: { key } });
        await db_1.db.$transaction(async (tx) => {
            await tx.setting.upsert({
                where: { key },
                update: { value: strValue },
                create: { key, value: strValue },
            });
            await tx.settingAuditLog.create({
                data: {
                    adminId,
                    key,
                    oldValue: existing ? existing.value : null,
                    newValue: strValue,
                },
            });
        });
        // Invalidate/update cache
        this.cache.set(key, { value: newValue, expiresAt: Date.now() + this.TTL_MS });
        return newValue;
    }
    static async getAll() {
        const all = await db_1.db.setting.findMany();
        const result = {};
        for (const def of DEFAULT_SETTINGS) {
            const found = all.find(s => s.key === def.key);
            result[def.key] = found ? this.parseValue(found.value, def.type) : def.defaultValue;
        }
        return result;
    }
}
exports.SettingsService = SettingsService;
