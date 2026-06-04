"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminServerActionSchema = void 0;
const zod_1 = require("zod");
exports.adminServerActionSchema = zod_1.z.object({
    serverId: zod_1.z.string().uuid()
});
