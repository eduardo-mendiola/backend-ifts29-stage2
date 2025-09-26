import express from 'express';
const router = express.Router();

import userController from '../controllers/UserController.js';
import { validateUserInput } from '../middleware/validationMiddleware.js'; 

router.post('/', validateUserInput, userController.create);

router.get('/', userController.getAll);

router.get('/:id', userController.getById);

router.put('/:id', userController.update);

router.patch('/:id', userController.patch);

router.delete('/:id', userController.delete);


export default router;
