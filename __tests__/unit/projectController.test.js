/**
 * Unit Tests - Project Controller
 * 
 * TDD Pattern: Arrange → Act → Assert
 * 
 * Tests unitarios aislados usando mocks para dependencias externas.
 * No requieren base de datos real, son más rápidos que integration tests.
 * 
 * Útiles para:
 * - Lógica de negocio compleja
 * - Funciones puras
 * - Validaciones
 * - Transformaciones de datos
 */

import ProjectController from '../../src/controllers/ProjectController.js';
import Project from '../../src/models/ProjectModel.js';

// Mock del modelo Project
jest.mock('../../src/models/ProjectModel.js');

describe('Unit Tests - ProjectController', () => {
  
  // Limpiar mocks antes de cada test
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getAll - Obtener todos los proyectos', () => {
    
    it('debe retornar todos los proyectos del modelo', async () => {
      // Arrange: Configurar el mock
      const mockProjects = [
        {
          _id: '507f1f77bcf86cd799439011',
          name: 'Project 1',
          status: 'pending',
          budget: 10000
        },
        {
          _id: '507f1f77bcf86cd799439012',
          name: 'Project 2',
          status: 'in_progress',
          budget: 20000
        }
      ];

      // Mockear el método findAll del modelo
      Project.findAll = jest.fn().mockResolvedValue(mockProjects);

      // Mock de req y res
      const req = {};
      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis()
      };

      // Act: Ejecutar el método del controlador
      await ProjectController.getAll(req, res);

      // Assert: Verificar comportamiento
      expect(Project.findAll).toHaveBeenCalledTimes(1);
      expect(res.json).toHaveBeenCalledWith(mockProjects);
      expect(res.json).toHaveBeenCalledTimes(1);
    });

    it('debe manejar errores correctamente', async () => {
      // Arrange
      const errorMessage = 'Database connection error';
      Project.findAll = jest.fn().mockRejectedValue(new Error(errorMessage));

      const req = {};
      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis()
      };

      // Act
      await ProjectController.getAll(req, res);

      // Assert
      expect(Project.findAll).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          error: expect.any(String)
        })
      );
    });

    it('debe retornar array vacío cuando no hay proyectos', async () => {
      // Arrange
      Project.findAll = jest.fn().mockResolvedValue([]);

      const req = {};
      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis()
      };

      // Act
      await ProjectController.getAll(req, res);

      // Assert
      expect(res.json).toHaveBeenCalledWith([]);
    });
  });

  describe('getById - Obtener proyecto por ID', () => {
    
    it('debe retornar proyecto cuando existe', async () => {
      // Arrange
      const mockProject = {
        _id: '507f1f77bcf86cd799439011',
        name: 'Test Project',
        status: 'pending'
      };

      Project.findById = jest.fn().mockResolvedValue(mockProject);

      const req = {
        params: { id: '507f1f77bcf86cd799439011' }
      };
      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis()
      };

      // Act
      await ProjectController.getById(req, res);

      // Assert
      expect(Project.findById).toHaveBeenCalledWith('507f1f77bcf86cd799439011');
      expect(res.json).toHaveBeenCalledWith(mockProject);
    });

    it('debe retornar 404 cuando el proyecto no existe', async () => {
      // Arrange
      Project.findById = jest.fn().mockResolvedValue(null);

      const req = {
        params: { id: '507f1f77bcf86cd799439011' }
      };
      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis()
      };

      // Act
      await ProjectController.getById(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          error: expect.any(String)
        })
      );
    });

    it('debe manejar IDs inválidos', async () => {
      // Arrange
      Project.findById = jest.fn().mockRejectedValue(
        new Error('Cast to ObjectId failed')
      );

      const req = {
        params: { id: 'invalid_id' }
      };
      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis()
      };

      // Act
      await ProjectController.getById(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(400);
    });
  });

  describe('create - Crear nuevo proyecto', () => {
    
    it('debe crear proyecto con datos válidos', async () => {
      // Arrange
      const projectData = {
        name: 'New Project',
        client_id: '507f1f77bcf86cd799439011',
        project_manager: '507f1f77bcf86cd799439012',
        budget: 50000
      };

      const createdProject = {
        _id: '507f1f77bcf86cd799439013',
        ...projectData,
        status: 'pending',
        billing_type: 'fixed'
      };

      Project.create = jest.fn().mockResolvedValue(createdProject);

      const req = {
        body: projectData
      };
      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis()
      };

      // Act
      await ProjectController.create(req, res);

      // Assert
      expect(Project.create).toHaveBeenCalledWith(projectData);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(createdProject);
    });

    it('debe rechazar creación con datos inválidos', async () => {
      // Arrange
      const invalidData = {
        name: 'Project without required fields'
        // Faltan client_id y project_manager
      };

      Project.create = jest.fn().mockRejectedValue(
        new Error('Validation failed: client_id is required')
      );

      const req = {
        body: invalidData
      };
      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis()
      };

      // Act
      await ProjectController.create(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          error: expect.stringContaining('required')
        })
      );
    });
  });

  describe('update - Actualizar proyecto', () => {
    
    it('debe actualizar proyecto existente', async () => {
      // Arrange
      const projectId = '507f1f77bcf86cd799439011';
      const updateData = {
        name: 'Updated Name',
        budget: 75000
      };

      const updatedProject = {
        _id: projectId,
        name: 'Updated Name',
        budget: 75000,
        status: 'pending'
      };

      Project.findByIdAndUpdate = jest.fn().mockResolvedValue(updatedProject);

      const req = {
        params: { id: projectId },
        body: updateData
      };
      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis()
      };

      // Act
      await ProjectController.update(req, res);

      // Assert
      expect(Project.findByIdAndUpdate).toHaveBeenCalledWith(
        projectId,
        updateData,
        expect.any(Object)
      );
      expect(res.json).toHaveBeenCalledWith(updatedProject);
    });

    it('debe retornar 404 cuando el proyecto no existe', async () => {
      // Arrange
      Project.findByIdAndUpdate = jest.fn().mockResolvedValue(null);

      const req = {
        params: { id: '507f1f77bcf86cd799439011' },
        body: { name: 'Updated Name' }
      };
      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis()
      };

      // Act
      await ProjectController.update(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(404);
    });
  });

  describe('delete - Eliminar proyecto', () => {
    
    it('debe eliminar proyecto existente', async () => {
      // Arrange
      const projectId = '507f1f77bcf86cd799439011';
      
      Project.findByIdAndDelete = jest.fn().mockResolvedValue({
        _id: projectId,
        name: 'Deleted Project'
      });

      const req = {
        params: { id: projectId }
      };
      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis()
      };

      // Act
      await ProjectController.delete(req, res);

      // Assert
      expect(Project.findByIdAndDelete).toHaveBeenCalledWith(projectId);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          message: expect.any(String)
        })
      );
    });

    it('debe retornar 404 cuando el proyecto no existe', async () => {
      // Arrange
      Project.findByIdAndDelete = jest.fn().mockResolvedValue(null);

      const req = {
        params: { id: '507f1f77bcf86cd799439011' }
      };
      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis()
      };

      // Act
      await ProjectController.delete(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(404);
    });
  });
});
