import express from 'express';
const router = express.Router();

import taskController from '../controllers/TaskController.js';
import { requirePermission } from '../middleware/permissionMiddleware.js';
// import { validateUserInput } from '../middleware/validationMiddleware.js'; 

router.post('/', requirePermission('create_tasks'), taskController.create);
router.get('/', requirePermission('view_tasks'), taskController.getAll);
router.get('/:id', requirePermission('view_tasks'), taskController.getById);
router.put('/:id', requirePermission('edit_tasks'), taskController.update);
router.patch('/:id', requirePermission('edit_tasks'), taskController.patch);
router.delete('/:id', requirePermission('delete_tasks'), taskController.delete);


export default router;
