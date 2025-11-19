import express from 'express';
const router = express.Router();

import documentFileController from '../controllers/DocumentFileController.js';
import { requirePermission } from '../middleware/permissionMiddleware.js';
// import { validateUserInput } from '../middleware/validationMiddleware.js'; 

router.post('/', requirePermission('create_document_files'), documentFileController.create);
router.get('/', requirePermission('view_document_files'), documentFileController.getAll);
router.get('/:id', requirePermission('view_document_files'), documentFileController.getById);
router.put('/:id', requirePermission('edit_document_files'), documentFileController.update);
router.patch('/:id', requirePermission('edit_document_files'), documentFileController.patch);
router.delete('/:id', requirePermission('delete_document_files'), documentFileController.delete);


export default router;
