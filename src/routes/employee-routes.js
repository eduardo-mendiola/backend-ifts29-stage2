import express from 'express';
const router = express.Router();

import employeeController from '../controllers/EmployeeController.js';
import { validateEmployeeInput } from '../middleware/validationMiddleware.js';
import { requirePermission } from '../middleware/permissionMiddleware.js'; 

router.post('/', requirePermission('create_employees'), validateEmployeeInput, employeeController.create);
router.get('/', requirePermission('view_employees'), employeeController.getAll);
router.get('/:id', requirePermission('view_employees'), employeeController.getById);
router.put('/:id', requirePermission('edit_employees'), employeeController.update);
router.patch('/:id', requirePermission('edit_employees'), employeeController.patch);
router.delete('/:id', requirePermission('delete_employees'), employeeController.delete);


export default router;
