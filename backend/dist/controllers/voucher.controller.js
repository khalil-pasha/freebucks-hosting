"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VoucherController = void 0;
const voucher_service_1 = require("../services/voucher.service");
const audit_service_1 = require("../services/audit.service");
class VoucherController {
    static async redeem(req, res) {
        try {
            const userId = req.user.id;
            const { code } = req.body;
            if (!code) {
                return res.status(400).json({ error: 'Voucher code is required' });
            }
            const data = await voucher_service_1.VoucherService.redeemVoucher(userId, code);
            await audit_service_1.AuditService.logAction(req, 'VOUCHER_REDEEM', code, userId);
            res.json(data);
        }
        catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
}
exports.VoucherController = VoucherController;
