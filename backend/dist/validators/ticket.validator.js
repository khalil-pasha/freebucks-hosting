"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.replyTicketSchema = exports.createTicketSchema = void 0;
const zod_1 = require("zod");
exports.createTicketSchema = zod_1.z.object({
    subject: zod_1.z.string().min(3).max(100),
    message: zod_1.z.string().min(10).max(5000)
});
exports.replyTicketSchema = zod_1.z.object({
    message: zod_1.z.string().min(2).max(5000)
});
