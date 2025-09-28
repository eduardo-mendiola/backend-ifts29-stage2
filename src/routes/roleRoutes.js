import express from 'express';
const router = express.Router();

import rolesController from '../controllers/RoleController.js';

router.post('/', rolesController.create);
router.get('/', rolesController.getAll);
router.get('/:id', rolesController.getById);
router.put('/:id', rolesController.update);
router.patch('/:id', rolesController.patch);
router.delete('/:id', rolesController.delete);

export default router;
