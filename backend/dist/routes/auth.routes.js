"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_controller_1 = require("../controllers/auth.controller");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
router.get('/discord', auth_controller_1.AuthController.login);
router.get('/discord/callback', auth_controller_1.AuthController.callback);
router.post('/logout', auth_controller_1.AuthController.logout);
// Protected routes
router.get('/me', auth_1.requireAuth, auth_controller_1.AuthController.me);
exports.default = router;
