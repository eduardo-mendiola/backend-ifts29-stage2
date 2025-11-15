import express from 'express';
const router = express.Router();

import invoiceController from '../controllers/InvoiceController.js';
import { requirePermission } from '../middleware/permissionMiddleware.js';
// import { validateUserInput } from '../middleware/validationMiddleware.js'; 

router.post('/', requirePermission('create_invoices'), invoiceController.create);
router.get('/', requirePermission('view_invoices'), invoiceController.getAll);
router.get('/:id', requirePermission('view_invoices'), invoiceController.getById);
router.put('/:id', requirePermission('edit_invoices'), invoiceController.update);
router.patch('/:id', requirePermission('edit_invoices'), invoiceController.patch);
router.delete('/:id', requirePermission('delete_invoices'), invoiceController.delete);
router.get('/:id/generate', requirePermission('view_invoices'), invoiceController.generateInvoiceView);
router.get('/:id/preview', requirePermission('view_invoices'), invoiceController.previewInvoiceView);
router.post('/:id/confirm-generate', requirePermission('create_invoices'), invoiceController.confirmGenerateInvoice);
router.put('/:id/status', requirePermission('edit_invoices'), invoiceController.updateStatus);






export default router;
