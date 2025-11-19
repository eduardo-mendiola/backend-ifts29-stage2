import express from 'express';
const router = express.Router();

import paymentController from '../controllers/PaymentController.js';
import { requirePermission } from '../middleware/permissionMiddleware.js';
// import { validateUserInput } from '../middleware/validationMiddleware.js'; 

router.post('/', requirePermission('create_payments'), paymentController.create);
router.get('/', requirePermission('view_payments'), paymentController.getAll);
router.get('/:id', requirePermission('view_payments'), paymentController.getById);
router.put('/:id', requirePermission('edit_payments'), paymentController.update);
router.patch('/:id', requirePermission('edit_payments'), paymentController.patch);
router.delete('/:id', requirePermission('delete_payments'), paymentController.delete);
router.put('/:id/status', requirePermission('edit_payments'), paymentController.updateStatus);


export default router;
