"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.upgradeServerSchema = exports.createServerSchema = void 0;
const zod_1 = require("zod");
exports.createServerSchema = zod_1.z.object({
    name: zod_1.z.string().min(3).max(50),
    ramGB: zod_1.z.number().positive().max(32),
    cpu: zod_1.z.number().positive().max(800),
    disk: zod_1.z.number().positive().max(100),
    pterodactyl: zod_1.z.object({
        email: zod_1.z.string().email(),
        username: zod_1.z.string().min(3).max(50),
        firstName: zod_1.z.string().min(1).max(50),
        lastName: zod_1.z.string().min(1).max(50),
        password: zod_1.z.string().min(8)
    }).optional()
});
exports.upgradeServerSchema = zod_1.z.object({
    ramGB: zod_1.z.number().positive().max(32),
    cpu: zod_1.z.number().positive().max(800),
    disk: zod_1.z.number().positive().max(100)
});
