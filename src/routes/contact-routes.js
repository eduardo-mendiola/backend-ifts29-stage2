import express from 'express';
// Definir las rutas relativas
const router = express.Router(); 
import contactController from '../controllers/ContactController.js';
// Importar middleware de validación


// Rutas CRUD para Clientes

router.post('/', contactController.create); 
router.get('/', contactController.getAll);
router.get('/:id', contactController.getById);
router.put('/:id', contactController.update);
router.patch('/:id', contactController.patch);
router.delete('/:id', contactController.delete);

export default router;
