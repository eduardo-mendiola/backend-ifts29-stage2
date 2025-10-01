import express from 'express';
const router = express.Router();

import taskController from '../controllers/TaskController.js';
// import { validateUserInput } from '../middleware/validationMiddleware.js'; 

router.post('/', taskController.create);
router.get('/', taskController.getAll);
router.get('/:id', taskController.getById);
router.put('/:id', taskController.update);
router.patch('/:id', taskController.patch);
router.delete('/:id', taskController.delete);


export default router;
