import express from 'express';
const router = express.Router();

import projectController from '../controllers/ProjectController.js';
// Importar middleware de validación
import { validateProjectInput } from '../middleware/validationMiddleware.js';

// Rutas CRUD para Proyectos

// POST /api/projects - Crear un nuevo proyecto
router.post('/', projectController.create);

// GET /api/projects - Obtener todos los proyectos
router.get('/', projectController.getAll);

// GET /api/projects/:id - Obtener un proyecto por ID
router.get('/:id', projectController.getById);

// PUT /api/projects/:id - Actualizar un proyecto por ID (reemplazo completo)
router.put('/:id', projectController.update);

// PATCH /api/projects/:id - Actualizar parcialmente un proyecto
router.patch('/:id', projectController.patch);

// DELETE /api/projects/:id - Eliminar un proyecto por ID
router.delete('/:id', projectController.delete);


// Lista de proyectos en vista pug
router.get('/', projectController.getAllView);

// Detalle de un proyecto
router.get('/:id', projectController.getByIdView);

// Formulario para editar un proyecto
router.get('/:id/edit', projectController.getByIdView);









export default router;