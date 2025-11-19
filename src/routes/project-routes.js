import express from 'express';
const router = express.Router();

import projectController from '../controllers/ProjectController.js';
import { requirePermission } from '../middleware/permissionMiddleware.js';


router.post('/', requirePermission('create_projects'), projectController.create);
router.get('/', requirePermission('view_projects'), projectController.getAll);
router.get('/:id', requirePermission('view_projects'), projectController.getById);
router.put('/:id', requirePermission('edit_projects'), projectController.update);
router.patch('/:id', requirePermission('edit_projects'), projectController.patch);
router.delete('/:id', requirePermission('delete_projects'), projectController.delete);


export default router;
