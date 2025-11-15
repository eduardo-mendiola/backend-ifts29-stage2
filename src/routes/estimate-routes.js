import express from 'express';
const router = express.Router();

import estimateController from '../controllers/EstimateController.js';
import { requirePermission } from '../middleware/permissionMiddleware.js';
// import { validateUserInput } from '../middleware/validationMiddleware.js'; 

router.post('/', requirePermission('create_estimates'), estimateController.create);
router.get('/', requirePermission('view_estimates'), estimateController.getAll);
router.get('/:id', requirePermission('view_estimates'), estimateController.getById);
router.put('/:id', requirePermission('edit_estimates'), estimateController.update);
router.patch('/:id', requirePermission('edit_estimates'), estimateController.patch);
router.delete('/:id', requirePermission('delete_estimates'), estimateController.delete);


export default router;
