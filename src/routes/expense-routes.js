import express from 'express';
const router = express.Router();

import expenseController from '../controllers/ExpenseController.js';
// import { validateUserInput } from '../middleware/validationMiddleware.js'; 

router.post('/', expenseController.create);
router.get('/', expenseController.getAll);
router.get('/:id', expenseController.getById);
router.put('/:id', expenseController.update);
router.patch('/:id', expenseController.patch);
router.delete('/:id', expenseController.delete);


export default router;
