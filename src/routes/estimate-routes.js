import express from 'express';
const router = express.Router();

import estimateController from '../controllers/EstimateController.js';
// import { validateUserInput } from '../middleware/validationMiddleware.js'; 

router.post('/', estimateController.create);
router.get('/', estimateController.getAll);
router.get('/:id', estimateController.getById);
router.put('/:id', estimateController.update);
router.patch('/:id', estimateController.patch);
router.delete('/:id', estimateController.delete);


export default router;
