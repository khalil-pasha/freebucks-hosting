"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const queue_controller_1 = require("../controllers/queue.controller");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
router.use(auth_1.requireAuth);
router.post('/start-server', queue_controller_1.QueueController.startServer);
router.post('/restart-server', queue_controller_1.QueueController.restartServer);
router.post('/cancel', queue_controller_1.QueueController.cancel); // Used for bypassing queue / stopping instantly
router.get('/status/:serverId', queue_controller_1.QueueController.getStatus);
router.get('/my-jobs', queue_controller_1.QueueController.myJobs);
exports.default = router;
