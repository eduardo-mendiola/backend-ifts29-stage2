import express from 'express';
const router = express.Router();

import timeEntryController from '../controllers/TimeEntryController.js';
import { requirePermission } from '../middleware/permissionMiddleware.js';
// import { validateUserInput } from '../middleware/validationMiddleware.js'; 

router.post('/', requirePermission('create_time_entries'), timeEntryController.create);
router.get('/', requirePermission('view_time_entries'), timeEntryController.getAll);
router.get('/:id', requirePermission('view_time_entries'), timeEntryController.getById);
router.put('/:id', requirePermission('edit_time_entries'), timeEntryController.update);
router.patch('/:id', requirePermission('edit_time_entries'), timeEntryController.patch);
router.delete('/:id', requirePermission('delete_time_entries'), timeEntryController.delete);

export default router;
