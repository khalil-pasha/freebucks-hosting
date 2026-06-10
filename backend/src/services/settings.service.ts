import { db } from '../utils/db';

type SettingValue = string | number | boolean;

interface SettingDefinition {
  key: string;
  type: 'string' | 'number' | 'boolean';
  defaultValue: SettingValue;
}

const DEFAULT_SETTINGS: SettingDefinition[] = [
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
  { key: 'serverRate2GB', type: 'number', defaultValue: 1.5 },
  { key: 'serverRate4GB', type: 'number', defaultValue: 3.0 },
  { key: 'serverRate6GB', type: 'number', defaultValue: 6.0 },
  { key: 'globalServerCap', type: 'number', defaultValue: 5000 },
];

export class SettingsService {
  private static cache: Map<string, { value: SettingValue; expiresAt: number }> = new Map();
  private static readonly TTL_MS = 60 * 1000; // 60 seconds

  public static async initDefaultSettings() {
    for (const def of DEFAULT_SETTINGS) {
      const existing = await db.setting.findUnique({ where: { key: def.key } });
      if (!existing) {
        await db.setting.create({
          data: {
            key: def.key,
            value: String(def.defaultValue),
            description: `Default: ${def.defaultValue}`,
          },
        });
      }
    }
  }

  private static parseValue(value: string, type: 'string' | 'number' | 'boolean'): SettingValue {
    if (type === 'number') return Number(value);
    if (type === 'boolean') return value === 'true';
    return value;
  }

  public static async get(key: string): Promise<SettingValue> {
    const cached = this.cache.get(key);
    if (cached && cached.expiresAt > Date.now()) {
      return cached.value;
    }

    const def = DEFAULT_SETTINGS.find(d => d.key === key);
    if (!def) throw new Error(`Unknown setting key: ${key}`);

    const setting = await db.setting.findUnique({ where: { key } });
    const value = setting ? this.parseValue(setting.value, def.type) : def.defaultValue;

    this.cache.set(key, { value, expiresAt: Date.now() + this.TTL_MS });
    return value;
  }

  public static async getNumber(key: string): Promise<number> {
    return (await this.get(key)) as number;
  }

  public static async getBoolean(key: string): Promise<boolean> {
    return (await this.get(key)) as boolean;
  }

  public static async getString(key: string): Promise<string> {
    return (await this.get(key)) as string;
  }

  public static async update(adminId: string, key: string, newValue: SettingValue) {
    const def = DEFAULT_SETTINGS.find(d => d.key === key);
    if (!def) throw new Error(`Unknown setting key: ${key}`);

    const strValue = String(newValue);
    
    // Log the change
    const existing = await db.setting.findUnique({ where: { key } });
    
    await db.$transaction(async (tx: any) => {
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

  public static async batchUpdate(adminId: string, updates: { key: string; value: SettingValue }[]) {
    // Validate all keys first
    for (const update of updates) {
      if (!DEFAULT_SETTINGS.find(d => d.key === update.key)) {
        throw new Error(`Unknown setting key: ${update.key}`);
      }
    }

    const results: SettingValue[] = [];
    await db.$transaction(async (tx: any) => {
      for (const update of updates) {
        const strValue = String(update.value);
        const existing = await tx.setting.findUnique({ where: { key: update.key } });
        
        await tx.setting.upsert({
          where: { key: update.key },
          update: { value: strValue },
          create: { key: update.key, value: strValue },
        });

        await tx.settingAuditLog.create({
          data: {
            adminId,
            key: update.key,
            oldValue: existing ? existing.value : null,
            newValue: strValue,
          },
        });
        
        results.push(update.value);
        // Invalidate/update cache immediately
        this.cache.set(update.key, { value: update.value, expiresAt: Date.now() + this.TTL_MS });
      }
    });

    return results;
  }

  public static async getAll() {
    const all = await db.setting.findMany();
    const result: Record<string, SettingValue> = {};
    for (const def of DEFAULT_SETTINGS) {
      const found = all.find(s => s.key === def.key);
      result[def.key] = found ? this.parseValue(found.value, def.type) : def.defaultValue;
    }
    return result;
  }
}
