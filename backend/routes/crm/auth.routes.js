import express from 'express';
import { login, logout, me } from '../../controllers/crm/auth.controller.js';
import { authCRM } from '../../middleware/authCRM.middleware.js';

const router = express.Router();

router.post('/login', login);
router.post('/logout', authCRM, logout);
router.get('/me', authCRM, me);

export default router;