import express from 'express';
const router = express.Router();

import receiptController from '../controllers/ReceiptController.js';
import { requirePermission } from '../middleware/permissionMiddleware.js';
// import { validateUserInput } from '../middleware/validationMiddleware.js'; 

router.post('/', requirePermission('create_receipts'), receiptController.create);
router.get('/', requirePermission('view_receipts'), receiptController.getAll);
router.get('/:id', requirePermission('view_receipts'), receiptController.getById);
router.put('/:id', requirePermission('edit_receipts'), receiptController.update);
router.patch('/:id', requirePermission('edit_receipts'), receiptController.patch);
router.delete('/:id', requirePermission('delete_receipts'), receiptController.delete);
router.put('/:id/status', requirePermission('edit_receipts'), receiptController.updateStatus);


export default router;
