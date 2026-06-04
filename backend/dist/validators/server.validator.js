"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createServerSchema = void 0;
const zod_1 = require("zod");
exports.createServerSchema = zod_1.z.object({
    name: zod_1.z.string().min(3).max(50),
    ramGB: zod_1.z.number().int().positive().max(32)
});
