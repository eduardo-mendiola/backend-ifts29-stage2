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
import taskRoutes from './routes/taskRoutes.js';
import teamRoutes from './routes/teamRoutes.js';
import teamRolRoutes from './routes/teamRolRoutes.js';

// Importar controladores para vistas
import ClientController from './controllers/ClientController.js';
import ProjectController from './controllers/ProjectController.js';
import UserController from './controllers/UserController.js';
import AreaController from './controllers/AreaController.js';
import RoleController from './controllers/RoleController.js';
import TaskController from './controllers/TaskController.js';
import TeamController from './controllers/TeamController.js'; 
import TeamRolController from './controllers/TeamRolController.js'; 


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
    res.render('index', { title: 'ClickWave' });
});

// POST login (temporal)
app.post('/admin', (req, res) => {
  // Por ahora no validamos usuarios, solo redirige
  res.redirect('/admin/dashboard');
});

// GET dashboard
app.get('/admin/dashboard', (req, res) => {
  res.render('admin', { title: 'Dashboard Admin' });
});


// Client
app.get('/clients/new', ClientController.newView); // IMPORTANTE: Esta ruta debe ir antes de la ruta con :id
app.post('/clients', ClientController.createView);
app.get('/clients', ClientController.getAllView);
app.get('/clients/:id', ClientController.getByIdView);
app.get('/clients/:id/edit', ClientController.getEditView); // Ruta para mostrar formulario de edición
app.put('/clients/:id', ClientController.updateView); // Ruta para procesar la actualización

// User
app.get('/users/new', UserController.newView); // IMPORTANTE: Esta ruta debe ir antes de la ruta con :id
app.post('/users', UserController.createView);
app.get('/users', UserController.getAllView);
app.get('/users/:id', UserController.getByIdView);
app.get('/users/:id/edit', UserController.getEditView); // Ruta para mostrar formulario de edición
app.put('/users/:id', UserController.updateView); // Ruta para procesar la actualización

// Project
app.get('/projects/new', ProjectController.newView); // IMPORTANTE: Esta ruta debe ir antes de la ruta con :id
app.post('/projects', ProjectController.createView);
app.get('/projects', ProjectController.getAllView);
app.get('/projects/:id', ProjectController.getByIdView);
app.get('/projects/:id/edit', ProjectController.getEditView); // Ruta para mostrar formulario de edición
app.put('/projects/:id', ProjectController.updateView); // Ruta para procesar la actualización

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

// Vistas Pug para tasks
app.get('/tasks', TaskController.getAllView);          
app.get('/tasks/new', TaskController.newView);        
app.get('/tasks/:id/edit', TaskController.getEditView); 
app.get('/tasks/:id', TaskController.getByIdView);  
app.post('/tasks', TaskController.createView);        
app.put('/tasks/:id', TaskController.updateView); 

// Vistas Pug para teams
app.get('/teams', TeamController.getAllView);          
app.get('/teams/new', TeamController.newView);        
app.get('/teams/:id/edit', TeamController.getEditView); 
app.get('/teams/:id', TeamController.getByIdView);  
app.post('/teams', TeamController.createView);        
app.put('/teams/:id', TeamController.updateView); 

// Vistas Pug para team_roles
app.get('/team_roles', TeamRolController.getAllView);          
app.get('/team_roles/new', TeamRolController.newView);        
app.get('/team_roles/:id/edit', TeamRolController.getEditView); 
app.get('/team_roles/:id', TeamRolController.getByIdView);  
app.post('/team_roles', TeamRolController.createView);        
app.put('/team_roles/:id', TeamRolController.updateView); 


// || Rutas base (endpoints de la API) ||
app.use('/api/clients', clientRoutes);
app.use('/api/users', userRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/roles', roleRoutes);
app.use('/api/areas', areaRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/teams', teamRoutes);
app.use('/api/team_roles', teamRolRoutes);


// Manejo de errores 404 para rutas no encontradas
app.use((req, res, next) => {
    res.render('error404', { tittle: 'Error'});
});

// Exportar la instancia de la aplicación
export default app;
