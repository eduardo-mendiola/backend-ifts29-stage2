import express from 'express';
const router = express.Router();

import paymentController from '../controllers/PaymentController.js';
// import { validateUserInput } from '../middleware/validationMiddleware.js'; 

router.post('/', paymentController.create);
router.get('/', paymentController.getAll);
router.get('/:id', paymentController.getById);
router.put('/:id', paymentController.update);
router.patch('/:id', paymentController.patch);
router.delete('/:id', paymentController.delete);
router.put('/:id/status', paymentController.updateStatus);


export default router;
