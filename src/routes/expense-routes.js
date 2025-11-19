import express from 'express';
const router = express.Router();

import expenseController from '../controllers/ExpenseController.js';
import { requirePermission } from '../middleware/permissionMiddleware.js';
// import { validateUserInput } from '../middleware/validationMiddleware.js'; 

router.post('/', requirePermission('create_expenses'), expenseController.create);
router.get('/', requirePermission('view_expenses'), expenseController.getAll);
router.get('/:id', requirePermission('view_expenses'), expenseController.getById);
router.put('/:id', requirePermission('edit_expenses'), expenseController.update);
router.patch('/:id', requirePermission('edit_expenses'), expenseController.patch);
router.delete('/:id', requirePermission('delete_expenses'), expenseController.delete);


export default router;
