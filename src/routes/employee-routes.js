import express from 'express';
const router = express.Router();

import employeeController from '../controllers/EmployeeController.js';
import { validateEmployeeInput } from '../middleware/validationMiddleware.js'; 

router.post('/', validateEmployeeInput, employeeController.create);
router.get('/', employeeController.getAll);
router.get('/:id', employeeController.getById);
router.put('/:id', employeeController.update);
router.patch('/:id', employeeController.patch);
router.delete('/:id', employeeController.delete);


export default router;
