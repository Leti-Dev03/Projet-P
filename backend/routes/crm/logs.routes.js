import express from 'express';
import { getLogs, getLogsByUser } from '../../controllers/crm/logs.controller.js';
import { authCRM } from '../../middleware/authCRM.middleware.js';
import { checkPermission } from '../../middleware/checkPermission.middleware.js';

const router = express.Router();

router.get('/', authCRM, checkPermission('logs', 'read'), getLogs);
router.get('/user/:id', authCRM, checkPermission('logs', 'read'), getLogsByUser);

export default router;