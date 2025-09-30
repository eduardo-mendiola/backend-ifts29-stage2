import express from 'express';
const router = express.Router();

import teamRolController from '../controllers/TeamRolController.js';
// import { validateUserInput } from '../middleware/validationMiddleware.js'; 

router.post('/', teamRolController.create);
router.get('/', teamRolController.getAll);
router.get('/:id', teamRolController.getById);
router.put('/:id', teamRolController.update);
router.patch('/:id', teamRolController.patch);
router.delete('/:id', teamRolController.delete);


export default router;
