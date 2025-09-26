import express from 'express';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import methodOverride from 'method-override';

// Importar rutas de cada entidad
import clientRoutes from './routes/clientRoutes.js';
import userRoutes from './routes/userRoutes.js';
import roleRoutes from './routes/roleRoutes.js';
import projectRoutes from './routes/projectRoutes.js';
import areaRoutes from './routes/areaRoutes.js';

// Importar controladores para vistas
import ClientController from './controllers/ClientController.js';
import ProjectController from './controllers/ProjectController.js';
import UserController from './controllers/UserController.js';
import AreaController from './controllers/AreaController.js';
import RoleController from './controllers/RoleController.js';


// __dirname en ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Inicialización y configuración básica
const app = express();

// Configuración de Pug como motor de vistas
app.set('views', join(__dirname,'..', 'views'));
app.set('view engine', 'pug')

// || Middlewares ||
app.use(express.json()); // Middleware para parsear cuerpos de solicitud en formato JSON

app.use(express.urlencoded({ extended: true }));
app.use(express.static(join(__dirname, 'public')))

// Middleware para soportar otros métodos HTTP como DELETE y PUT
app.use(methodOverride('_method'));

// || Rutas para las vistas del CRUD (HTML) - Pug ||

// Ruta de bienvenida 
app.get('/', (req, res) => {
    // res.json({ 
    //     title: 'Bienvenido a la API de ClickWave', 
    //     message: 'Gestiona tus proyectos, clientes y tiempo.' 
    // });
    res.render('index', { title: 'ClickWave' });
});


// Client
app.get('/clients', ClientController.getAllView);
app.get('/clients/:id', ClientController.getByIdView);
// app.get('/clients/new', (req, res) => res.render('client-form', { title: 'Nuevo Cliente', client: {} }));
// app.get('/clients/:id/edit', ClientController.getByIdView);

app.get('/client-form', ClientController.newView);
app.post('/clients', ClientController.createView);


// User
app.get('/users', UserController.getAllView);
app.get('/users/new', UserController.newView);
app.post('/users', UserController.createView);
app.get('/users/:id/edit', UserController.getEditView); // Nueva ruta para mostrar formulario de edición
app.put('/users/:id', UserController.updateView); // Nueva ruta para procesar la actualización
app.get('/users/:id', UserController.getByIdView);

// Project views Pug
app.get('/projects', ProjectController.getAllView);
app.get('/projects/:id', ProjectController.getByIdView);
app.get('/projects/:id/edit', ProjectController.getByIdView);

// Vistas Pug para áreas
app.get('/areas', AreaController.getAllView);
app.get('/areas/new', AreaController.newView);
app.get('/areas/:id/edit', AreaController.getEditView);
app.get('/areas/:id', AreaController.getByIdView);
app.post('/areas', AreaController.createView);
app.put('/areas/:id', AreaController.updateView);

// Vistas Pug para roles
app.get('/roles', RoleController.getAllView);          
app.get('/roles/new', RoleController.newView);        
app.get('/roles/:id/edit', RoleController.getEditView); 
app.get('/roles/:id', RoleController.getByIdView);  
app.post('/roles', RoleController.createView);        
app.put('/roles/:id', RoleController.updateView);    


// || Rutas base (endpoints de la API) ||
app.use('/api/client', clientRoutes);
app.use('/api/users', userRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/roles', roleRoutes);
app.use('/api/areas', areaRoutes);


// Manejo de errores 404 para rutas no encontradas
app.use((req, res, next) => {
    // res.status(404).json({ 
    //     error: 'Página no encontrada',
    //     message: 'La ruta que intentas acceder no existe.'
    // });
    res.render('error404', { tittle: 'Error'});
});

// Exportar la instancia de la aplicación
export default app;
