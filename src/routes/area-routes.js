import express from 'express';
const router = express.Router();

import areaController from '../controllers/AreaController.js';

// CRUD API
router.post('/', areaController.create);
router.get('/', areaController.getAll);
router.get('/:id', areaController.getById);
router.put('/:id', areaController.update);
router.patch('/:id', areaController.patch);
router.delete('/:id', areaController.delete);

export default router;
