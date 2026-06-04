"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateSettingSchema = void 0;
const zod_1 = require("zod");
exports.updateSettingSchema = zod_1.z.object({
    key: zod_1.z.string().min(1).max(100),
    value: zod_1.z.union([zod_1.z.string(), zod_1.z.number(), zod_1.z.boolean()]).transform(val => String(val))
});
