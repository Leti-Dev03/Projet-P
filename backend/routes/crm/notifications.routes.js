import express from 'express';
import { getMyNotifications, markAsRead, markAllAsRead } from '../../controllers/crm/notifications.controller.js';
import { authCRM } from '../../middleware/authCRM.middleware.js';

const router = express.Router();

router.get('/', authCRM, getMyNotifications);
router.put('/read-all', authCRM, markAllAsRead);
router.put('/:id/read', authCRM, markAsRead);

export default router;