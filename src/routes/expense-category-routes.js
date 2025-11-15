import express from 'express';
const router = express.Router();

import expenseCategoryController from '../controllers/ExpenseCategoryController.js';
import { requirePermission } from '../middleware/permissionMiddleware.js';

// CRUD API
router.post('/', requirePermission('create_expense_categories'), expenseCategoryController.create);
router.get('/', requirePermission('view_expense_categories'), expenseCategoryController.getAll);
router.get('/:id', requirePermission('view_expense_categories'), expenseCategoryController.getById);
router.put('/:id', requirePermission('edit_expense_categories'), expenseCategoryController.update);
router.patch('/:id', requirePermission('edit_expense_categories'), expenseCategoryController.patch);
router.delete('/:id', requirePermission('delete_expense_categories'), expenseCategoryController.delete);

export default router;
