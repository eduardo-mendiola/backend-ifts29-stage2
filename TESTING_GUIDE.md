# Guía Completa de Testing - API RESTful

## Tabla de Contenidos

1. [Introducción](#introducción)
2. [Configuración del Entorno](#configuración-del-entorno)
3. [Estructura del Proyecto](#estructura-del-proyecto)
4. [TDD - Test Driven Development](#tdd---test-driven-development)
5. [Ejecutar Tests](#ejecutar-tests)
6. [Tipos de Tests](#tipos-de-tests)
7. [Buenas Prácticas](#buenas-prácticas)
8. [Ejemplos](#ejemplos)
9. [Troubleshooting](#troubleshooting)

---

## Introducción

Este proyecto implementa un sistema completo de testing siguiendo **Test Driven Development (TDD)** con las siguientes tecnologías:

- **Jest**: Framework principal de testing
- **Supertest**: Testing de endpoints HTTP
- **MongoDB Memory Server**: Base de datos en memoria para tests

### Ventajas de este enfoque

- Tests aislados y rápidos
- No contamina la base de datos de desarrollo
- Fácil integración con CI/CD
- Cobertura de código automática
- Refactoring seguro

---

## Configuración del Entorno

### Instalación de Dependencias

```bash
npm install --save-dev jest supertest mongodb-memory-server @types/jest
```

### Scripts Disponibles

```json
{
  "test": "node --experimental-vm-modules node_modules/jest/bin/jest.js --runInBand",
  "test:watch": "node --experimental-vm-modules node_modules/jest/bin/jest.js --watch --runInBand",
  "test:coverage": "node --experimental-vm-modules node_modules/jest/bin/jest.js --coverage --runInBand"
}
```

### Configuración de Jest

El archivo `jest.config.js` está configurado para:

- Soporte de ES Modules nativos
- MongoDB Memory Server
- Cobertura de código
- Tests en secuencia (importante para DB)

---

## Estructura del Proyecto

```
__tests__/
├── setup/
│   ├── globalSetup.js      # Inicializar MongoDB Memory Server
│   ├── globalTeardown.js   # Limpiar MongoDB Memory Server
│   └── setupTests.js       # Configuración por archivo de test
├── helpers/
│   └── testHelpers.js      # Funciones auxiliares (conectDB, clearDB)
├── builders/
│   └── dataBuilders.js     # Patrón Builder para datos de prueba
├── fixtures/
│   └── testData.js         # Datos estáticos de prueba
├── integration/
│   ├── projects.test.js    # Tests de integración POST
│   └── projects-crud.test.js # Tests GET, PUT, DELETE
└── unit/
    ├── projectController.test.js  # Tests unitarios con mocks
    └── dateHelpers.test.js        # Tests de funciones puras
```

---

## TDD - Test Driven Development

### Ciclo Red → Green → Refactor

#### 1. **RED** - Escribir test que falla

```javascript
it('debe crear un proyecto con datos válidos', async () => {
  const response = await request(app)
    .post('/api/projects')
    .send(validProjectData)
    .expect(201);
  
  expect(response.body).toHaveProperty('_id');
});
```

#### 2. **GREEN** - Escribir código mínimo para pasar el test

```javascript
// En ProjectController
create = async (req, res) => {
  try {
    const project = await Project.create(req.body);
    res.status(201).json(project);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
```

#### 3. **REFACTOR** - Mejorar código manteniendo tests verdes

```javascript
// Refactorizar para mejor manejo de errores
create = async (req, res) => {
  try {
    const project = await this.model.create(req.body);
    return res.status(201).json(this.formatItem(project));
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({ error: this.formatValidationError(error) });
    }
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
};
```

---

## Ejecutar Tests

### Comandos Básicos

```bash
# Ejecutar todos los tests
npm test

# Ejecutar tests en modo watch (útil durante desarrollo)
npm run test:watch

# Ejecutar con reporte de cobertura
npm run test:coverage

# Ejecutar tests específicos
npm test projects.test.js

# Ejecutar solo tests de integración
npm test -- __tests__/integration

# Ejecutar solo tests unitarios
npm test -- __tests__/unit
```

### Modo Interactivo

En modo watch (`npm run test:watch`):

- Presiona `p` para filtrar por nombre de archivo
- Presiona `t` para filtrar por nombre de test
- Presiona `a` para ejecutar todos los tests
- Presiona `q` para salir

---

## Tipos de Tests

### 1. Tests de Integración

**Cuándo usar:**
- Verificar comportamiento completo de endpoints
- Validar interacción con base de datos
- Probar flujos de usuarios reales

**Ejemplo:**

```javascript
describe('POST /api/projects', () => {
  beforeAll(async () => {
    await connectDB();
  });

  beforeEach(async () => {
    await clearDatabase(); // Importante: aislar tests
  });

  afterAll(async () => {
    await disconnectDB();
  });

  it('debe crear proyecto con datos válidos', async () => {
    // Arrange
    const client = await Client.create(new ClientBuilder().build());
    const employee = await Employee.create(new EmployeeBuilder().build());
    
    const projectData = new ProjectBuilder()
      .withClient(client._id)
      .withManager(employee._id)
      .build();

    // Act
    const response = await request(app)
      .post('/api/projects')
      .send(projectData)
      .expect(201);

    // Assert
    expect(response.body).toHaveProperty('_id');
    expect(response.body.name).toBe(projectData.name);
  });
});
```

### 2. Tests Unitarios

**Cuándo usar:**
- Probar lógica de negocio aislada
- Validar funciones puras
- Verificar manejo de errores
- Tests muy rápidos

**Ejemplo con Mocks:**

```javascript
jest.mock('../../src/models/ProjectModel.js');

describe('ProjectController.getAll', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('debe retornar todos los proyectos', async () => {
    // Arrange
    const mockProjects = [{ name: 'Project 1' }];
    Project.findAll = jest.fn().mockResolvedValue(mockProjects);

    const req = {};
    const res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis()
    };

    // Act
    await ProjectController.getAll(req, res);

    // Assert
    expect(Project.findAll).toHaveBeenCalledTimes(1);
    expect(res.json).toHaveBeenCalledWith(mockProjects);
  });
});
```

**Ejemplo de Función Pura:**

```javascript
describe('formatDate', () => {
  it('debe formatear fecha a YYYY-MM-DD', () => {
    // Arrange
    const date = new Date('2024-03-15T10:30:00Z');

    // Act
    const result = formatDate(date);

    // Assert
    expect(result).toBe('2024-03-15');
  });
});
```

---

## Buenas Prácticas

### 1. Organización de Tests

#### Patrón AAA (Arrange-Act-Assert)

```javascript
it('descripción clara del test', () => {
  // Arrange: Preparar datos y estado
  const input = 'test data';
  const expected = 'TEST DATA';

  // Act: Ejecutar función/acción
  const result = toUpperCase(input);

  // Assert: Verificar resultado
  expect(result).toBe(expected);
});
```

#### Usar `describe` para agrupar

```javascript
describe('ProjectController', () => {
  describe('create', () => {
    it('debe crear con datos válidos', () => {});
    it('debe rechazar datos inválidos', () => {});
  });

  describe('update', () => {
    it('debe actualizar existente', () => {});
    it('debe retornar 404 si no existe', () => {});
  });
});
```

### 2. Builder Pattern para Datos de Prueba

**Ventajas:**
- Código más legible
- Fácil crear variaciones
- Reduce duplicación

```javascript
const project = new ProjectBuilder()
  .withName('My Project')
  .withBudget(50000)
  .inProgress()
  .build();

// Crear sin ciertos campos (testing validaciones)
const invalidProject = new ProjectBuilder()
  .buildWithout('name', 'client_id');
```

### 3. Fixtures para Datos Consistentes

```javascript
import { VALID_PROJECT, FIXTURE_IDS } from '../fixtures/testData.js';

it('debe usar datos de fixture', async () => {
  const response = await request(app)
    .post('/api/projects')
    .send(VALID_PROJECT);
  
  expect(response.status).toBe(201);
});
```

### 4. Helpers para Evitar Repetición

```javascript
// En lugar de repetir setup en cada test
beforeEach(async () => {
  await connectDB();
  await clearDatabase();
});

afterAll(async () => {
  await disconnectDB();
});
```

### 5. Nombres Descriptivos

**Mal:**
```javascript
it('should work', () => {});
it('test 1', () => {});
```

**Bien:**
```javascript
it('debe retornar 400 cuando falta el nombre del proyecto', () => {});
it('debe crear proyecto con tipo de facturación "hourly"', () => {});
```

### 6. Un Concepto por Test

**Mal:**
```javascript
it('debe crear, actualizar y eliminar proyecto', () => {
  // Demasiado en un solo test
});
```

**Bien:**
```javascript
it('debe crear proyecto', () => {});
it('debe actualizar proyecto', () => {});
it('debe eliminar proyecto', () => {});
```

### 7. Limpiar Base de Datos Entre Tests

```javascript
beforeEach(async () => {
  await clearDatabase(); // CRUCIAL para aislar tests
});
```

### 8. No Depender del Orden de Ejecución

Cada test debe ser independiente:

```javascript
// Mal: Test depende de otro
it('debe crear proyecto', () => {
  // crea proyecto con ID conocido
});

it('debe obtener proyecto creado', () => {
  // asume que existe el proyecto anterior
});

// Bien: Tests independientes
it('debe crear proyecto', async () => {
  const response = await request(app).post('/api/projects').send(data);
  expect(response.status).toBe(201);
});

it('debe obtener proyecto por ID', async () => {
  const project = await Project.create(validData); // Crear en el mismo test
  const response = await request(app).get(`/api/projects/${project._id}`);
  expect(response.status).toBe(200);
});
```

---

## Ejemplos Prácticos

### Validar Campos Requeridos

```javascript
it('debe retornar 400 cuando falta el nombre', async () => {
  const invalidData = new ProjectBuilder()
    .buildWithout('name');

  const response = await request(app)
    .post('/api/projects')
    .send(invalidData);

  expect(response.status).toBe(400);
  expect(response.body.error).toMatch(/name|nombre|requerido/i);
});
```

### Validar Enumeraciones

```javascript
it('debe aceptar todos los valores válidos de status', async () => {
  const validStatuses = ['pending', 'in_progress', 'completed'];

  for (const status of validStatuses) {
    const data = new ProjectBuilder().build();
    data.status = status;

    const response = await request(app)
      .post('/api/projects')
      .send(data);

    expect(response.status).toBe(201);
    expect(response.body.status).toBe(status);
  }
});
```

### Verificar Timestamps Automáticos

```javascript
it('debe generar timestamps automáticamente', async () => {
  const response = await request(app)
    .post('/api/projects')
    .send(validProjectData)
    .expect(201);

  expectValidTimestamp(response.body.created_at);
  expectValidTimestamp(response.body.updated_at);
});
```

### Mocking de Servicios Externos

```javascript
import emailService from '../../src/services/emailService.js';

jest.mock('../../src/services/emailService.js');

it('debe enviar email de notificación', async () => {
  emailService.send = jest.fn().mockResolvedValue(true);

  await ProjectController.create(req, res);

  expect(emailService.send).toHaveBeenCalledWith(
    expect.objectContaining({
      to: 'manager@example.com',
      subject: 'Nuevo Proyecto Creado'
    })
  );
});
```

---

## Troubleshooting

### Problemas Comunes

#### 1. "Cannot find module"

**Problema:** Jest no encuentra módulos ES.

**Solución:**
```bash
# Ejecutar con flag experimental
node --experimental-vm-modules node_modules/jest/bin/jest.js
```

#### 2. Tests cuelgan o no terminan

**Problema:** Conexiones de DB abiertas.

**Solución:**
```javascript
afterAll(async () => {
  await disconnectDB(); // Asegurar cierre
});
```

Agregar a `jest.config.js`:
```javascript
{
  forceExit: true,
  detectOpenHandles: true
}
```

#### 3. Tests fallan intermitentemente

**Problema:** Tests no aislados o dependencias de orden.

**Solución:**
```javascript
beforeEach(async () => {
  await clearDatabase(); // Limpiar antes de CADA test
});
```

#### 4. MongoDB Memory Server falla al iniciar

**Problema:** Puerto ocupado o permisos.

**Solución:**
```javascript
// En globalSetup.js
const mongod = await MongoMemoryServer.create({
  instance: {
    port: 27018 // Usar puerto diferente
  }
});
```

#### 5. Cobertura baja inesperada

**Problema:** Archivos no incluidos.

**Solución:** Verificar `jest.config.js`:
```javascript
{
  collectCoverageFrom: [
    'src/**/*.js',
    '!src/**/*.test.js'
  ]
}
```

---

## Cobertura de Código

### Interpretar el Reporte

```
--------------------|---------|----------|---------|---------|
File                | % Stmts | % Branch | % Funcs | % Lines |
--------------------|---------|----------|---------|---------|
ProjectController   |   92.5  |   85.7   |   100   |   92.1  |
dateHelpers         |   100   |   100    |   100   |   100   |
--------------------|---------|----------|---------|---------|
```

- **Stmts**: Porcentaje de líneas ejecutadas
- **Branch**: Porcentaje de ramas (if/else) cubiertas
- **Funcs**: Porcentaje de funciones llamadas
- **Lines**: Similar a Stmts

### Objetivos Recomendados

- **Funciones críticas**: 90%+
- **Utilidades**: 100%
- **Controladores**: 80%+
- **Proyecto general**: 70%+

---

## Recursos Adicionales

- [Jest Documentation](https://jestjs.io/)
- [Supertest GitHub](https://github.com/visionmedia/supertest)
- [MongoDB Memory Server](https://github.com/nodkz/mongodb-memory-server)
- [TDD by Example - Kent Beck](https://www.amazon.com/Test-Driven-Development-Kent-Beck/dp/0321146530)

---



