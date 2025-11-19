import express from 'express';
const router = express.Router();

import teamRolController from '../controllers/TeamRolController.js';
import { requirePermission } from '../middleware/permissionMiddleware.js';
// import { validateUserInput } from '../middleware/validationMiddleware.js'; 

router.post('/', requirePermission('create_team_roles'), teamRolController.create);
router.get('/', requirePermission('view_team_roles'), teamRolController.getAll);
router.get('/:id', requirePermission('view_team_roles'), teamRolController.getById);
router.put('/:id', requirePermission('edit_team_roles'), teamRolController.update);
router.patch('/:id', requirePermission('edit_team_roles'), teamRolController.patch);
router.delete('/:id', requirePermission('delete_team_roles'), teamRolController.delete);


export default router;
