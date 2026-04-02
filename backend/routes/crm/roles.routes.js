import express from 'express';
import {
  getAllRoles,
  createRole,
  updateRole,
  deleteRole,
  getRolePermissions,
  updateRolePermissions,
  getAllRessources,
} from '../../controllers/crm/roles.controller.js';
import { authCRM } from '../../middleware/authCRM.middleware.js';
import { checkPermission } from '../../middleware/checkPermission.middleware.js';

const router = express.Router();

router.get('/', authCRM, checkPermission('roles', 'read'), getAllRoles);
router.post('/', authCRM, checkPermission('roles', 'create'), createRole);
router.put('/:id', authCRM, checkPermission('roles', 'update'), updateRole);
router.delete('/:id', authCRM, checkPermission('roles', 'delete'), deleteRole);
router.get('/ressources', authCRM, checkPermission('roles', 'read'), getAllRessources);
router.get('/:id/permissions', authCRM, checkPermission('roles', 'read'), getRolePermissions);
router.put('/:id/permissions', authCRM, checkPermission('roles', 'update'), updateRolePermissions);

export default router;