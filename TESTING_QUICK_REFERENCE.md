# Quick Reference - Testing

## Comandos Esenciales

```bash
# Ejecutar todos los tests
npm test

# Ejecutar en modo watch (recomendado durante desarrollo)
npm run test:watch

# Ejecutar con reporte de cobertura
npm run test:coverage

# Ejecutar smoke test (verificar que todo funciona)
npm test -- smoke.test.js

# Ejecutar solo tests de integración
npm test -- __tests__/integration

# Ejecutar solo tests unitarios
npm test -- __tests__/unit

# Ejecutar test específico por nombre de archivo
npm test -- projects.test.js

# Ejecutar test específico por patrón
npm test -- -t "debe crear proyecto"

# Ver ayuda de Jest
npm test -- --help
```

## Estructura de un Test de Integración

```javascript
import request from 'supertest';
import app from '../../src/app.js';
import { connectDB, clearDatabase, disconnectDB } from '../helpers/testHelpers.js';
import { ProjectBuilder } from '../builders/dataBuilders.js';

describe('Integration Tests - [Entidad] API', () => {
  beforeAll(async () => await connectDB());
  beforeEach(async () => await clearDatabase());
  afterAll(async () => await disconnectDB());

  it('debe [descripción de lo que hace]', async () => {
    // Arrange: Preparar datos
    const data = new ProjectBuilder().withName('Test').build();

    // Act: Ejecutar acción
    const response = await request(app)
      .post('/api/projects')
      .send(data)
      .expect(201);

    // Assert: Verificar resultado
    expect(response.body).toHaveProperty('_id');
    expect(response.body.name).toBe('Test');
  });
});
```

## Estructura de un Test Unitario

```javascript
import { myFunction } from '../../src/utils/myUtil.js';

describe('Unit Tests - [Componente]', () => {
  beforeEach(() => {
    // Limpiar mocks si usas jest.mock
  });

  it('debe [descripción]', () => {
    // Arrange
    const input = 'test';
    const expected = 'TEST';

    // Act
    const result = myFunction(input);

    // Assert
    expect(result).toBe(expected);
  });
});
```

## Usar Builders

```javascript
import { ProjectBuilder, ClientBuilder, EmployeeBuilder } from '../builders/dataBuilders.js';

// Crear con valores por defecto
const project = new ProjectBuilder().build();

// Personalizar valores
const customProject = new ProjectBuilder()
  .withName('Mi Proyecto')
  .withBudget(50000)
  .inProgress()
  .build();

// Crear sin campos (para testing de validaciones)
const invalidProject = new ProjectBuilder()
  .buildWithout('name', 'client_id');
```

## Helpers Disponibles

```javascript
import {
  connectDB,           // Conectar a MongoDB Memory Server
  clearDatabase,       // Limpiar todas las colecciones
  disconnectDB,        // Cerrar conexión
  createTestUser,      // Crear usuario de prueba
  generateObjectId,    // Generar ObjectId válido
  expectApiError,      // Validar estructura de error
  pickFields,          // Extraer campos específicos
  createMany           // Crear múltiples documentos
} from '../helpers/testHelpers.js';

// Ejemplo
beforeEach(async () => {
  await clearDatabase();
});
```

## Fixtures

```javascript
import {
  VALID_PROJECT,
  VALID_CLIENT,
  VALID_EMPLOYEE,
  FIXTURE_IDS,
  ERROR_MESSAGES
} from '../fixtures/testData.js';

// Usar datos válidos predefinidos
const response = await request(app)
  .post('/api/projects')
  .send(VALID_PROJECT);

// Usar IDs consistentes
const project = await Project.findById(FIXTURE_IDS.project1);

// Usar mensajes de error esperados
expect(error).toContain(ERROR_MESSAGES.REQUIRED_FIELD('name'));
```

## Assertions Comunes

```javascript
// Status codes
expect(response.status).toBe(201);
expect(response.status).toBe(400);
expect(response.status).toBe(404);

// Headers
expect(response.headers['content-type']).toMatch(/json/);

// Propiedades de objeto
expect(response.body).toHaveProperty('_id');
expect(response.body.name).toBe('Test');

// Arrays
expect(response.body).toHaveLength(3);
expect(array).toContain('value');

// MongoDB ObjectId válido
expectValidMongoId(response.body._id);

// Timestamp válido
expectValidTimestamp(response.body.created_at);

// Valores definidos/undefined
expect(value).toBeDefined();
expect(value).toBeUndefined();
expect(value).toBeNull();

// Booleanos
expect(value).toBe(true);
expect(value).toBeTruthy();
expect(value).toBeFalsy();

// Números
expect(value).toBeGreaterThan(10);
expect(value).toBeLessThan(100);
expect(value).toBeCloseTo(10.5, 1);

// Strings
expect(string).toMatch(/pattern/);
expect(string).toContain('substring');

// Objetos
expect(obj).toEqual({ key: 'value' }); // Deep equality
expect(obj).toMatchObject({ key: 'value' }); // Partial match

// Arrays de objetos
expect(array).toEqual(
  expect.arrayContaining([
    expect.objectContaining({ name: 'Test' })
  ])
);

// Errores
expect(() => fn()).toThrow();
expect(() => fn()).toThrow('Error message');
expect(async () => await fn()).rejects.toThrow();
```

## Mocking

```javascript
import Model from '../../src/models/MyModel.js';

// Mock del modelo completo
jest.mock('../../src/models/MyModel.js');

// Mock de método específico
Model.findAll = jest.fn().mockResolvedValue(mockData);
Model.create = jest.fn().mockResolvedValue(createdData);
Model.findById = jest.fn().mockResolvedValue(null); // Simular no encontrado

// Mock de error
Model.findAll = jest.fn().mockRejectedValue(new Error('DB Error'));

// Verificar llamadas
expect(Model.findAll).toHaveBeenCalled();
expect(Model.findAll).toHaveBeenCalledTimes(1);
expect(Model.findAll).toHaveBeenCalledWith('arg1', 'arg2');

// Limpiar mocks
jest.clearAllMocks(); // Antes de cada test
```

## Debugging

```javascript
// Ver el body completo de la respuesta
console.log('Response:', JSON.stringify(response.body, null, 2));

// Ver error completo
console.log('Error:', error.message);

// Ver datos enviados
console.log('Sent:', JSON.stringify(data, null, 2));

// Usar debugger
debugger; // Ejecutar con --inspect

// Ver qué tests se están ejecutando
npm test -- --verbose

// Ver por qué un test falla
npm test -- --no-coverage
```

## Troubleshooting Rápido

### Tests cuelgan

```bash
# Verificar conexiones abiertas
npm test -- --detectOpenHandles

# Forzar salida
# Ya configurado en jest.config.js con forceExit: true
```

### Error "Cannot find module"

```bash
# Asegurarse de usar flag experimental
# Ya configurado en package.json scripts
```

### Tests fallan intermitentemente

```javascript
// Asegurarse de limpiar DB antes de CADA test
beforeEach(async () => {
  await clearDatabase(); // IMPORTANTE
});
```

### MongoDB Memory Server falla

```javascript
// Verificar que no hay otra instancia corriendo en el puerto
// Por defecto usa puerto 27018
```

## Ciclo TDD

```
1. RED 
   - Escribir test que falla
   - Ejecutar: npm test

2. GREEN 
   - Escribir código mínimo para pasar
   - Ejecutar: npm test

3. REFACTOR 
   - Mejorar código
   - Ejecutar: npm test (debe seguir pasando)
```

## Coverage

```bash
# Ver reporte de cobertura
npm run test:coverage

# Abrir reporte HTML
open coverage/lcov-report/index.html  # Mac/Linux
start coverage/lcov-report/index.html # Windows
```

## Archivos Clave

```
jest.config.js              → Configuración de Jest
__tests__/setup/            → Setup global
__tests__/helpers/          → Funciones auxiliares
__tests__/builders/         → Builders para datos
__tests__/fixtures/         → Datos estáticos
__tests__/integration/      → Tests de endpoints
__tests__/unit/            → Tests unitarios
TESTING_GUIDE.md           → Guía completa
```

## Flujo de Trabajo Típico

1. **Escribir el test** (TDD - RED)
   ```bash
   npm run test:watch
   ```

2. **Implementar la función** (GREEN)
   - El test pasa 

3. **Refactorizar** (REFACTOR)
   - Tests siguen pasando 

4. **Verificar cobertura**
   ```bash
   npm run test:coverage
   ```

5. **Commit**
   ```bash
   git add .
   git commit -m "feat: implement feature with tests"
   ```

---

**Para más detalles ver [TESTING_GUIDE.md](./TESTING_GUIDE.md)**
