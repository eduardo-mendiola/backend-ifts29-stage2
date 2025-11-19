import express from 'express';
const router = express.Router();

import rolesController from '../controllers/RoleController.js';
import { requirePermission } from '../middleware/permissionMiddleware.js';

router.post('/', requirePermission('create_roles'), rolesController.create);
router.get('/', requirePermission('view_roles'), rolesController.getAll);
router.get('/:id', requirePermission('view_roles'), rolesController.getById);
router.put('/:id', requirePermission('edit_roles'), rolesController.update);
router.patch('/:id', requirePermission('edit_roles'), rolesController.patch);
router.delete('/:id', requirePermission('delete_roles'), rolesController.delete);

export default router;
