import express from 'express';
const router = express.Router();

import receiptController from '../controllers/ReceiptController.js';
// import { validateUserInput } from '../middleware/validationMiddleware.js'; 

router.post('/', receiptController.create);
router.get('/', receiptController.getAll);
router.get('/:id', receiptController.getById);
router.put('/:id', receiptController.update);
router.patch('/:id', receiptController.patch);
router.delete('/:id', receiptController.delete);


export default router;
