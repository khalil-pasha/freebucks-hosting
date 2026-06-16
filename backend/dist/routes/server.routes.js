"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const server_controller_1 = require("../controllers/server.controller");
const server_panel_controller_1 = require("../controllers/server-panel.controller");
const auth_1 = require("../middleware/auth");
const validate_1 = require("../middleware/validate");
const server_validator_1 = require("../validators/server.validator");
const router = (0, express_1.Router)();
router.use(auth_1.requireAuth);
// User-facing Invites
router.get('/invites', server_panel_controller_1.ServerPanelController.listUserInvites);
router.post('/invites/:inviteId/accept', server_panel_controller_1.ServerPanelController.acceptInvite);
router.post('/invites/:inviteId/decline', server_panel_controller_1.ServerPanelController.declineInvite);
router.post('/create', (0, validate_1.validate)(server_validator_1.createServerSchema), server_controller_1.ServerController.createServer);
router.patch('/:id/upgrade', (0, validate_1.validate)(server_validator_1.upgradeServerSchema), server_controller_1.ServerController.upgradeServer);
router.get('/rates', server_controller_1.ServerController.getRates);
router.get('/my-servers', server_controller_1.ServerController.myServers);
exports.default = router;
