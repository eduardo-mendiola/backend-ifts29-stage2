import express from 'express';
const router = express.Router();

import timeEntryController from '../controllers/TimeEntryController.js';
// import { validateUserInput } from '../middleware/validationMiddleware.js'; 

router.post('/', timeEntryController.create);
router.get('/', timeEntryController.getAll);
router.get('/:id', timeEntryController.getById);
router.put('/:id', timeEntryController.update);
router.patch('/:id', timeEntryController.patch);
router.delete('/:id', timeEntryController.delete);

export default router;
