"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const referral_controller_1 = require("../controllers/referral.controller");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
router.use(auth_1.requireAuth);
router.post('/claim', referral_controller_1.ReferralController.claim);
exports.default = router;
