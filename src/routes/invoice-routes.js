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


export default router;
