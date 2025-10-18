import express from 'express';
const router = express.Router();

import invoiceController from '../controllers/InvoiceController.js';
// import { validateUserInput } from '../middleware/validationMiddleware.js'; 

router.post('/', invoiceController.create);
router.get('/', invoiceController.getAll);
router.get('/:id', invoiceController.getById);
router.put('/:id', invoiceController.update);
router.patch('/:id', invoiceController.patch);
router.delete('/:id', invoiceController.delete);
router.get('/:id/generate', invoiceController.generateInvoiceView);
router.get('/:id/preview', invoiceController.previewInvoiceView);
router.post('/:id/confirm-generate', invoiceController.confirmGenerateInvoice);
router.put('/:id/status', invoiceController.updateStatus);






export default router;
