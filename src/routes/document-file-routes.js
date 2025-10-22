import express from 'express';
const router = express.Router();

import documentFileController from '../controllers/DocumentFileController.js';
// import { validateUserInput } from '../middleware/validationMiddleware.js'; 

router.post('/', documentFileController.create);
router.get('/', documentFileController.getAll);
router.get('/:id', documentFileController.getById);
router.put('/:id', documentFileController.update);
router.patch('/:id', documentFileController.patch);
router.delete('/:id', documentFileController.delete);


export default router;
