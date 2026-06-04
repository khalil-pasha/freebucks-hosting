"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const voucher_controller_1 = require("../controllers/voucher.controller");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
router.use(auth_1.requireAuth);
router.post('/redeem', voucher_controller_1.VoucherController.redeem);
exports.default = router;
