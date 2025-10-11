import express from 'express';
const router = express.Router();

import expenseCategoryController from '../controllers/ExpenseCategoryController.js';

// CRUD API
router.post('/', expenseCategoryController.create);
router.get('/', expenseCategoryController.getAll);
router.get('/:id', expenseCategoryController.getById);
router.put('/:id', expenseCategoryController.update);
router.patch('/:id', expenseCategoryController.patch);
router.delete('/:id', expenseCategoryController.delete);

export default router;
