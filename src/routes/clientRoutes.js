import express from 'express';
// Definir las rutas relativas
const router = express.Router(); 
import clientController from '../controllers/ClientController.js';
// Importar middleware de validación
import { validateClientInput } from '../middleware/validationMiddleware.js'; 

// Rutas CRUD para Clientes

// POST /api/clients - Crear un nuevo cliente
router.post('/', validateClientInput, clientController.create); // Middleware de validación antes del controlador

// GET /api/clients - Obtener todos los clientes
router.get('/', clientController.getAll);

// GET /api/clients/:id - Obtener un cliente por ID
router.get('/:id', clientController.getById);// Ruta dinámica con parámetro `:id`

// PUT /api/clients/:id - Actualizar un cliente por ID
router.put('/:id', clientController.update);

// PUT /api/clients/:id - Actualizar un cliente por ID
router.patch('/:id', clientController.patch);

// DELETE /api/clients/:id - Eliminar un cliente por ID
router.delete('/:id', clientController.delete);

export default router;
