import express from 'express';
const router = express.Router();

import userController from '../controllers/UserController.js';
import { requirePermission } from '../middleware/permissionMiddleware.js';
// import { validateUserInput } from '../middleware/validationMiddleware.js'; 

router.post('/', requirePermission('create_users'), userController.create);
router.get('/', requirePermission('view_users'), userController.getAll);
router.get('/:id', requirePermission('view_users'), userController.getById);
router.put('/:id', requirePermission('edit_users'), userController.update);
router.patch('/:id', requirePermission('edit_users'), userController.patch);
router.delete('/:id', requirePermission('delete_users'), userController.delete);


export default router;
