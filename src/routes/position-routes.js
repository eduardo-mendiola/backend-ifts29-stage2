import express from 'express';
const router = express.Router();

import positionController from '../controllers/PositionController.js';
import { requirePermission } from '../middleware/permissionMiddleware.js';

// CRUD API
router.post('/', requirePermission('create_positions'), positionController.create);
router.get('/', requirePermission('view_positions'), positionController.getAll);
router.get('/:id', requirePermission('view_positions'), positionController.getById);
router.put('/:id', requirePermission('edit_positions'), positionController.update);
router.patch('/:id', requirePermission('edit_positions'), positionController.patch);
router.delete('/:id', requirePermission('delete_positions'), positionController.delete);

export default router;
