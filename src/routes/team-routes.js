import express from 'express';
const router = express.Router();

import teamController from '../controllers/TeamController.js';
import { requirePermission } from '../middleware/permissionMiddleware.js';
// import { validateUserInput } from '../middleware/validationMiddleware.js'; 

router.post('/', requirePermission('create_teams'), teamController.create);
router.get('/', requirePermission('view_teams'), teamController.getAll);
router.get('/:id', requirePermission('view_teams'), teamController.getById);
router.put('/:id', requirePermission('edit_teams'), teamController.update);
router.patch('/:id', requirePermission('edit_teams'), teamController.patch);
router.delete('/:id', requirePermission('delete_teams'), teamController.delete);


export default router;
