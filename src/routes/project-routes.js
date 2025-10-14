import express from 'express';
const router = express.Router();

import projectController from '../controllers/ProjectController.js';


router.post('/', projectController.create);
router.get('/', projectController.getAll);
router.get('/:id', projectController.getById);
router.put('/:id', projectController.update);
router.patch('/:id', projectController.patch);
router.delete('/:id', projectController.delete);


export default router;
