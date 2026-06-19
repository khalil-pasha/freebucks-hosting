"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const server_panel_controller_1 = require("../controllers/server-panel.controller");
const auth_1 = require("../middleware/auth");
const server_access_1 = require("../middleware/server-access");
const router = (0, express_1.Router)({ mergeParams: true });
router.use(auth_1.requireAuth);
router.get('/status', (0, server_access_1.requireServerAccess)(), server_panel_controller_1.ServerPanelController.getStatus);
router.get('/websocket', (0, server_access_1.requireServerAccess)('console'), server_panel_controller_1.ServerPanelController.getWebsocket);
router.post('/power', (0, server_access_1.requireServerAccess)('console'), server_panel_controller_1.ServerPanelController.powerAction);
router.post('/command', (0, server_access_1.requireServerAccess)('console'), server_panel_controller_1.ServerPanelController.sendCommand);
router.post('/eula/accept', (0, server_access_1.requireServerAccess)('console'), server_panel_controller_1.ServerPanelController.acceptEula);
// Files
router.get('/files', (0, server_access_1.requireServerAccess)('files'), server_panel_controller_1.ServerPanelController.listFiles);
router.get('/files/content', (0, server_access_1.requireServerAccess)('files'), server_panel_controller_1.ServerPanelController.getFileContent);
router.post('/files/write', (0, server_access_1.requireServerAccess)('files'), server_panel_controller_1.ServerPanelController.saveFileContent);
router.post('/files/rename', (0, server_access_1.requireServerAccess)('files'), server_panel_controller_1.ServerPanelController.renameFiles);
router.post('/files/create-folder', (0, server_access_1.requireServerAccess)('files'), server_panel_controller_1.ServerPanelController.createFolder);
router.post('/files/delete', (0, server_access_1.requireServerAccess)('files'), server_panel_controller_1.ServerPanelController.deleteFiles);
router.post('/files/chmod', (0, server_access_1.requireServerAccess)('files'), server_panel_controller_1.ServerPanelController.chmodFiles);
router.post('/files/archive', (0, server_access_1.requireServerAccess)('files'), server_panel_controller_1.ServerPanelController.compressFiles);
router.post('/files/decompress', (0, server_access_1.requireServerAccess)('files'), server_panel_controller_1.ServerPanelController.decompressFile);
router.get('/files/upload', (0, server_access_1.requireServerAccess)('files'), server_panel_controller_1.ServerPanelController.getUploadUrl);
router.get('/files/download', (0, server_access_1.requireServerAccess)('files'), server_panel_controller_1.ServerPanelController.getDownloadUrl);
// Plugins
router.get('/plugins', (0, server_access_1.requireServerAccess)('files'), server_panel_controller_1.ServerPanelController.listPlugins);
router.post('/plugins/install-url', (0, server_access_1.requireServerAccess)('files'), server_panel_controller_1.ServerPanelController.installPluginUrl);
router.delete('/plugins', (0, server_access_1.requireServerAccess)('files'), server_panel_controller_1.ServerPanelController.deletePlugin);
router.post('/plugins/rename', (0, server_access_1.requireServerAccess)('files'), server_panel_controller_1.ServerPanelController.renamePlugin);
// Users & Invites
router.get('/users', (0, server_access_1.requireServerAccess)('settings'), server_panel_controller_1.ServerPanelController.listUsers);
router.post('/users', (0, server_access_1.requireServerAccess)('settings'), server_panel_controller_1.ServerPanelController.inviteUser);
router.delete('/users/:accessId', (0, server_access_1.requireServerAccess)('settings'), server_panel_controller_1.ServerPanelController.removeUser);
router.delete('/users/invites/:inviteId', (0, server_access_1.requireServerAccess)('settings'), server_panel_controller_1.ServerPanelController.cancelInvite);
// Subdomain
router.get('/subdomain', (0, server_access_1.requireServerAccess)('settings'), server_panel_controller_1.ServerPanelController.getSubdomain);
router.post('/subdomain', (0, server_access_1.requireServerAccess)('settings'), server_panel_controller_1.ServerPanelController.generateSubdomain);
// Activity
router.get('/activity', (0, server_access_1.requireServerAccess)('activity'), server_panel_controller_1.ServerPanelController.getActivity);
// Settings
router.patch('/settings', (0, server_access_1.requireServerAccess)('settings'), server_panel_controller_1.ServerPanelController.updateSettings);
router.post('/reinstall', (0, server_access_1.requireServerAccess)('settings'), server_panel_controller_1.ServerPanelController.reinstallServer);
router.post('/settings/reset-world', (0, server_access_1.requireServerAccess)('settings'), server_panel_controller_1.ServerPanelController.resetWorld);
// Startup
router.get('/startup', (0, server_access_1.requireServerAccess)('settings'), server_panel_controller_1.ServerPanelController.getStartup);
router.post('/startup', (0, server_access_1.requireServerAccess)('settings'), server_panel_controller_1.ServerPanelController.updateStartup);
router.put('/docker-image', (0, server_access_1.requireServerAccess)('settings'), server_panel_controller_1.ServerPanelController.updateDockerImage);
exports.default = router;
