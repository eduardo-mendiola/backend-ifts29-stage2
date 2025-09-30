import express from 'express';
const router = express.Router();

import teamController from '../controllers/TeamController.js';
// import { validateUserInput } from '../middleware/validationMiddleware.js'; 

router.post('/', teamController.create);
router.get('/', teamController.getAll);
router.get('/:id', teamController.getById);
router.put('/:id', teamController.update);
router.patch('/:id', teamController.patch);
router.delete('/:id', teamController.delete);


export default router;
