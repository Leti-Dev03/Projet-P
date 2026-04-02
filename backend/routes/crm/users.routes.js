import express from 'express';
import {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  toggleStatut,
  assignRole,
  resetPassword,
} from '../../controllers/crm/users.controller.js';
import { authCRM } from '../../middleware/authCRM.middleware.js';
import { checkPermission } from '../../middleware/checkPermission.middleware.js';

const router = express.Router();

router.get('/', authCRM, checkPermission('utilisateurs', 'read'), getAllUsers);
router.get('/:id', authCRM, checkPermission('utilisateurs', 'read'), getUserById);
router.post('/', authCRM, checkPermission('utilisateurs', 'create'), createUser);
router.put('/:id', authCRM, checkPermission('utilisateurs', 'update'), updateUser);
router.put('/:id/statut', authCRM, checkPermission('utilisateurs', 'update'), toggleStatut);
router.put('/:id/role', authCRM, checkPermission('utilisateurs', 'update'), assignRole);
router.post('/:id/reset-password', authCRM, checkPermission('utilisateurs', 'update'), resetPassword);

export default router;