import express from 'express';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import methodOverride from 'method-override';

// Importar rutas de cada entidad
import clientRoutes from './routes/client-routes.js';
import userRoutes from './routes/user-routes.js';
import roleRoutes from './routes/role-routes.js';
import projectRoutes from './routes/project-routes.js';
import areaRoutes from './routes/area-routes.js';
import taskRoutes from './routes/task-routes.js';
import teamRoutes from './routes/team-routes.js';
import teamRolRoutes from './routes/team-rol-routes.js';
import timeEntryRoutes from './routes/time-entry-routes.js';
import positionRoutes from './routes/position-routes.js';
import contactRoutes from './routes/contact-routes.js';
import estimateRoutes from './routes/estimate-routes.js';
import expenseRoutes from './routes/expense-routes.js';
import invoiceRoutes from './routes/invoice-routes.js';
import paymentRoutes from './routes/payment-routes.js';

// Importar controladores para vistas
import ClientController from './controllers/ClientController.js';
import ProjectController from './controllers/ProjectController.js';
import UserController from './controllers/UserController.js';
import AreaController from './controllers/AreaController.js';
import RoleController from './controllers/RoleController.js';
import TaskController from './controllers/TaskController.js';
import TeamController from './controllers/TeamController.js'; 
import TeamRolController from './controllers/TeamRolController.js'; 
import TimeEntryController from './controllers/TimeEntryController.js';
import PositionController from './controllers/PositionController.js';
import ContactController from './controllers/ContactController.js';
import EstimateController from './controllers/EstimateController.js';
import ExpenseController from './controllers/ExpenseController.js';
import InvoiceController from './controllers/InvoiceController.js';
import PaymentController from './controllers/PaymentController.js';


// ||----------------------------------------------------------------------------------------------------------||


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
app.use(express.static(join(__dirname, '..', 'public')));

// Middleware para soportar otros métodos HTTP como DELETE y PUT
app.use(methodOverride('_method'));


// ||----------------------------------- Rutas para las vistas Pug -----------------------------------------||

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

// ||--------------------------- Rutas para las vistas del CRUD (HTML) - Pug -------------------------------||
// Client
app.get('/clients/new', ClientController.newView); // IMPORTANTE: Esta ruta debe ir antes de la ruta con :id
app.post('/clients', ClientController.createView); // Ruta para procesar la creación
app.get('/clients', ClientController.getAllView); // Ruta para listar todos los clientes
app.get('/clients/:id', ClientController.getByIdView); // Ruta para mostrar detalles (con contactos asociados)
app.get('/clients/:id/edit', ClientController.getEditView); // Ruta para mostrar formulario de edición
app.put('/clients/:id', ClientController.updateView); // Ruta para procesar la actualización

// User
app.get('/users/new', UserController.newView); 
app.post('/users', UserController.createView);
app.get('/users', UserController.getAllView);
app.get('/users/:id', UserController.getByIdView);
app.get('/users/:id/edit', UserController.getEditView); 
app.put('/users/:id', UserController.updateView); 

// Project
app.get('/projects/new', ProjectController.newView); 
app.post('/projects', ProjectController.createView);
app.get('/projects', ProjectController.getAllView);
app.get('/projects/:id', ProjectController.getByIdView);
app.get('/projects/:id/edit', ProjectController.getEditView); 
app.put('/projects/:id', ProjectController.updateView); 

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
app.get('/team-roles', TeamRolController.getAllView);          
app.get('/team-roles/new', TeamRolController.newView);        
app.get('/team-roles/:id/edit', TeamRolController.getEditView); 
app.get('/team-roles/:id', TeamRolController.getByIdView);  
app.post('/team-roles', TeamRolController.createView);        
app.put('/team-roles/:id', TeamRolController.updateView); 

// Vistas Pug para time_entries
app.get('/time-entries', TimeEntryController.getAllView);          
app.get('/time-entries/new', TimeEntryController.newView);        
app.get('/time-entries/:id/edit', TimeEntryController.getEditView); 
app.get('/time-entries/:id', TimeEntryController.getByIdView);  
app.post('/time-entries', TimeEntryController.createView);        
app.put('/time-entries/:id', TimeEntryController.updateView); 

// Vistas Pug para positions
app.get('/positions', PositionController.getAllView);          
app.get('/positions/new', PositionController.newView);        
app.get('/positions/:id/edit', PositionController.getEditView); 
app.get('/positions/:id', PositionController.getByIdView);  
app.post('/positions', PositionController.createView);        
app.put('/positions/:id', PositionController.updateView); 

// Vistas Pug para contacts
app.get('/contacts', ContactController.getAllView);          
app.get('/contacts/new', ContactController.newView);        
app.get('/contacts/:id/edit', ContactController.getEditView); 
app.get('/contacts/:id', ContactController.getByIdView);  
app.post('/contacts', ContactController.createView);        
app.put('/contacts/:id', ContactController.updateView); 

// Vistas Pug para Estimates
app.get('/estimates', EstimateController.getAllView);          
app.get('/estimates/new', EstimateController.newView);        
app.get('/estimates/:id/edit', EstimateController.getEditView); 
app.get('/estimates/:id', EstimateController.getByIdView);  
app.post('/estimates', EstimateController.createView);        
app.put('/estimates/:id', EstimateController.updateView); 

// Vistas Pug para Expenses
app.get('/expenses', ExpenseController.getAllView);          
app.get('/expenses/new', ExpenseController.newView);
app.get('/expenses/:id/edit', ExpenseController.getEditView);
app.get('/expenses/:id', ExpenseController.getByIdView);  
app.post('/expenses', ExpenseController.createView);        
app.put('/expenses/:id', ExpenseController.updateView);

// Vistas Pug para Invoices
app.get('/invoices', InvoiceController.getAllView);          
app.get('/invoices/new', InvoiceController.newView);
app.get('/invoices/:id/edit', InvoiceController.getEditView);
app.get('/invoices/:id', InvoiceController.getByIdView);  
app.post('/invoices', InvoiceController.createView);        
app.put('/invoices/:id', InvoiceController.updateView);

// Vistas Pug para Payments
app.get('/payments', PaymentController.getAllView);          
app.get('/payments/new', PaymentController.newView);
app.get('/payments/:id/edit', PaymentController.getEditView);
app.get('/payments/:id', PaymentController.getByIdView);  
app.post('/payments', PaymentController.createView);        
app.put('/payments/:id', PaymentController.updateView);




// || -----------------------------Rutas base (endpoints de la API) ------------------------------||
app.use('/api/clients', clientRoutes);
app.use('/api/users', userRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/roles', roleRoutes);
app.use('/api/areas', areaRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/teams', teamRoutes);
app.use('/api/team-roles', teamRolRoutes);
app.use('/api/time-entries', timeEntryRoutes);
app.use('/api/positions', positionRoutes);
app.use('/api/contacts', contactRoutes);
app.use('/api/estimates', estimateRoutes);
app.use('/api/expenses', expenseRoutes);
app.use('/api/invoices', invoiceRoutes);
app.use('/api/payments', paymentRoutes);


// ||--------------------------------------------------------------------------------------------------||


// Manejo de rutas no encontradas (404)
app.use((req, res) => {
    res.status(404);
    if (req.accepts('html')) {
        res.render('error404', { title: 'Página no encontrada' });
    } else if (req.accepts('json')) {
        res.json({ message: 'Ruta no encontrada' });
    } else {
        res.type('txt').send('Ruta no encontrada');
    }
});

// Exportar la instancia de la aplicación
export default app;
