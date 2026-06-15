import { Router } from 'express';
import { ServerPanelController } from '../controllers/server-panel.controller';
import { requireAuth } from '../middleware/auth';
import { requireServerAccess } from '../middleware/server-access';

const router = Router({ mergeParams: true });

router.use(requireAuth);

router.get('/status', requireServerAccess(), ServerPanelController.getStatus);
router.get('/websocket', requireServerAccess(), ServerPanelController.getWebsocket);

router.post('/power', requireServerAccess('console'), ServerPanelController.powerAction);
router.post('/command', requireServerAccess('console'), ServerPanelController.sendCommand);

// Files
router.get('/files', requireServerAccess('files'), ServerPanelController.listFiles);
router.get('/files/content', requireServerAccess('files'), ServerPanelController.getFileContent);
router.post('/files/write', requireServerAccess('files'), ServerPanelController.saveFileContent);
router.post('/files/rename', requireServerAccess('files'), ServerPanelController.renameFiles);
router.post('/files/create-folder', requireServerAccess('files'), ServerPanelController.createFolder);
router.post('/files/delete', requireServerAccess('files'), ServerPanelController.deleteFiles);
router.get('/files/upload', requireServerAccess('files'), ServerPanelController.getUploadUrl);
router.get('/files/download', requireServerAccess('files'), ServerPanelController.getDownloadUrl);

// Users
router.get('/users', requireServerAccess('settings'), ServerPanelController.listUsers);
router.post('/users', requireServerAccess('settings'), ServerPanelController.inviteUser);
router.delete('/users/:accessId', requireServerAccess('settings'), ServerPanelController.removeUser);

// Subdomain
router.get('/subdomain', requireServerAccess('settings'), ServerPanelController.getSubdomain);
router.post('/subdomain', requireServerAccess('settings'), ServerPanelController.generateSubdomain);

// Activity
router.get('/activity', requireServerAccess('activity'), ServerPanelController.getActivity);

// Settings
router.patch('/settings', requireServerAccess('settings'), ServerPanelController.updateSettings);
router.post('/reinstall', requireServerAccess('settings'), ServerPanelController.reinstallServer);

// Startup
router.get('/startup', requireServerAccess('settings'), ServerPanelController.getStartup);
router.post('/startup', requireServerAccess('settings'), ServerPanelController.updateStartup);
router.put('/docker-image', requireServerAccess('settings'), ServerPanelController.updateDockerImage);

export default router;
