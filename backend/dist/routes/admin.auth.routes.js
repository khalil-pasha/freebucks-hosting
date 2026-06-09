"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const admin_auth_controller_1 = require("../controllers/admin.auth.controller");
const router = (0, express_1.Router)();
router.post('/login', admin_auth_controller_1.AdminAuthController.login);
router.post('/logout', admin_auth_controller_1.AdminAuthController.logout);
router.get('/me', admin_auth_controller_1.AdminAuthController.me);
exports.default = router;
