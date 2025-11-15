import express from 'express';
const router = express.Router();

import areaController from '../controllers/AreaController.js';
import { requirePermission } from '../middleware/permissionMiddleware.js';

// CRUD API
router.post('/', requirePermission('create_areas'), areaController.create);
router.get('/', requirePermission('view_areas'), areaController.getAll);
router.get('/:id', requirePermission('view_areas'), areaController.getById);
router.put('/:id', requirePermission('edit_areas'), areaController.update);
router.patch('/:id', requirePermission('edit_areas'), areaController.patch);
router.delete('/:id', requirePermission('delete_areas'), areaController.delete);

export default router;
