import express from 'express';
// Definir las rutas relativas
const router = express.Router(); 
import contactController from '../controllers/ContactController.js';
import { requirePermission } from '../middleware/permissionMiddleware.js';
// Importar middleware de validación


// Rutas CRUD para Clientes

router.post('/', requirePermission('create_contacts'), contactController.create); 
router.get('/', requirePermission('view_contacts'), contactController.getAll);
router.get('/:id', requirePermission('view_contacts'), contactController.getById);
router.put('/:id', requirePermission('edit_contacts'), contactController.update);
router.patch('/:id', requirePermission('edit_contacts'), contactController.patch);
router.delete('/:id', requirePermission('delete_contacts'), contactController.delete);

export default router;
