"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.redeemVoucherSchema = void 0;
const zod_1 = require("zod");
exports.redeemVoucherSchema = zod_1.z.object({
    code: zod_1.z.string().min(3).max(50)
});
