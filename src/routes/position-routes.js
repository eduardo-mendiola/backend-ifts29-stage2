import express from 'express';
const router = express.Router();

import positionController from '../controllers/PositionController.js';

// CRUD API
router.post('/', positionController.create);
router.get('/', positionController.getAll);
router.get('/:id', positionController.getById);
router.put('/:id', positionController.update);
router.patch('/:id', positionController.patch);
router.delete('/:id', positionController.delete);

export default router;
