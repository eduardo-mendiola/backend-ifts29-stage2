import express from 'express';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import methodOverride from 'method-override';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import flash from 'connect-flash';
import passport from './config/passport.js';

// Importar rutas de autenticación
import authRoutes from './routes/auth-routes.js';
import apiAuthRoutes from './routes/api-auth-routes.js';

// Importar middleware de autenticación
import { isAuthenticated } from './middleware/authMiddleware.js';
import { injectPermissionHelpers, requirePermission } from './middleware/permissionMiddleware.js';

// Importar rutas de cada entidad
import clientRoutes from './routes/client-routes.js';
import userRoutes from './routes/user-routes.js';
import employeeRoutes from './routes/employee-routes.js';
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
import expenseCategoryRoutes from './routes/expense-category-routes.js';
import receiptRoutes from './routes/receipt-routes.js';
import documentFileRoutes from './routes/document-file-routes.js';

// Importar controladores para vistas
import ClientController from './controllers/ClientController.js';
import ProjectController from './controllers/ProjectController.js';
import UserController from './controllers/UserController.js';
import EmployeeController from './controllers/EmployeeController.js';
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
import ExpenseCategoryController from './controllers/ExpenseCategoryController.js';
import ReceiptController from './controllers/ReceiptController.js';
import DocumentFileController from './controllers/DocumentFileController.js';


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

// Configuración de sesiones con MongoDB
app.use(session({
  secret: process.env.SESSION_SECRET || 'your_session_secret_here',
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: process.env.MONGO_URI_ATLAS,
    touchAfter: 24 * 3600, // Actualizar sesión solo una vez cada 24 horas
    crypto: {
      secret: process.env.SESSION_SECRET || 'your_session_secret_here'
    }
  }),
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 * 7, // 7 días
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production' // HTTPS en producción
  }
}));

// Flash messages
app.use(flash());

// Inicializar Passport y sesiones
app.use(passport.initialize());
app.use(passport.session());

// Middleware para inyectar helpers de permisos en todas las vistas
app.use(injectPermissionHelpers);

// Variables globales para todas las vistas
app.use((req, res, next) => {
  res.locals.user = req.user || null;
  res.locals.error = req.flash('error');
  res.locals.success = req.flash('success');
  res.locals.isAuthenticated = req.isAuthenticated();
  
  // Log temporal para depuración
  if (res.locals.error.length > 0) {
    console.log('🔴 Flash Error Messages:', res.locals.error);
  }
  if (res.locals.success.length > 0) {
    console.log('🟢 Flash Success Messages:', res.locals.success);
  }
  
  next();
});


// ||----------------------------------- Rutas para las vistas Pug -----------------------------------------||

// Rutas de autenticación (login, register, logout)
app.use('/', authRoutes);

// NOTA: Las rutas protegidas ahora usan el middleware isAuthenticated

// GET dashboard (protegido por auth-routes.js)
// app.get('/admin/dashboard', isAuthenticated, ...) - Ahora en auth-routes.js

// ||--------------------------- Rutas para las vistas del CRUD (HTML) - Pug -------------------------------||
// TODAS LAS RUTAS DE VISTAS AHORA ESTÁN PROTEGIDAS CON isAuthenticated

// Client
app.get('/clients/new', isAuthenticated, ClientController.newView); // IMPORTANTE: Esta ruta debe ir antes de la ruta con :id
app.post('/clients', isAuthenticated, ClientController.createView); // Ruta para procesar la creación
app.get('/clients', isAuthenticated, ClientController.getAllView); // Ruta para listar todos los clientes
app.get('/clients/:id', isAuthenticated, ClientController.getByIdView); // Ruta para mostrar detalles (con contactos asociados)
app.get('/clients/:id/edit', isAuthenticated, ClientController.getEditView); // Ruta para mostrar formulario de edición
app.put('/clients/:id', isAuthenticated, ClientController.updateView); // Ruta para procesar la actualización

// User
app.get('/users/new', isAuthenticated, requirePermission('create_users'), UserController.newView); 
app.post('/users', isAuthenticated, requirePermission('create_users'), UserController.createView);
app.get('/users', isAuthenticated, UserController.getAllView);
app.get('/users/:id', isAuthenticated, UserController.getByIdView);
app.get('/users/:id/edit', isAuthenticated, requirePermission('edit_users'), UserController.getEditView); 
app.put('/users/:id', isAuthenticated, requirePermission('edit_users'), UserController.updateView); 

// Employee
app.get('/employees/new', isAuthenticated, requirePermission('create_employees'), EmployeeController.newView); 
app.post('/employees', isAuthenticated, requirePermission('create_employees'), EmployeeController.createView);
app.get('/employees', isAuthenticated, EmployeeController.getAllView);
app.get('/employees/:id', isAuthenticated, EmployeeController.getByIdView);
app.get('/employees/:id/edit', isAuthenticated, requirePermission('edit_employees'), EmployeeController.getEditView); 
app.put('/employees/:id', isAuthenticated, requirePermission('edit_employees'), EmployeeController.updateView); 

// Project
app.get('/projects/new', isAuthenticated, requirePermission('create_projects'), ProjectController.newView); 
app.post('/projects', isAuthenticated, requirePermission('create_projects'), ProjectController.createView);
app.get('/projects', isAuthenticated, ProjectController.getAllView);
app.get('/projects/:id', isAuthenticated, ProjectController.getByIdView);
app.get('/projects/:id/edit', isAuthenticated, requirePermission('edit_projects'), ProjectController.getEditView); 
app.put('/projects/:id', isAuthenticated, requirePermission('edit_projects'), ProjectController.updateView); 

// Vistas Pug para áreas
app.get('/areas', isAuthenticated, AreaController.getAllView);
app.get('/areas/new', isAuthenticated, AreaController.newView);
app.get('/areas/:id/edit', isAuthenticated, AreaController.getEditView);
app.get('/areas/:id', isAuthenticated, AreaController.getByIdView);
app.post('/areas', isAuthenticated, AreaController.createView);
app.put('/areas/:id', isAuthenticated, AreaController.updateView);

// Vistas Pug para roles
app.get('/roles', isAuthenticated, RoleController.getAllView);          
app.get('/roles/new', isAuthenticated, requirePermission('create_roles'), RoleController.newView);        
app.get('/roles/:id/edit', isAuthenticated, requirePermission('edit_roles'), RoleController.getEditView); 
app.get('/roles/:id', isAuthenticated, RoleController.getByIdView);  
app.post('/roles', isAuthenticated, requirePermission('create_roles'), RoleController.createView);        
app.put('/roles/:id', isAuthenticated, requirePermission('edit_roles'), RoleController.updateView);    

// Vistas Pug para tasks
app.get('/tasks', isAuthenticated, TaskController.getAllView);          
app.get('/tasks/new', isAuthenticated, requirePermission('create_tasks'), TaskController.newView);        
app.get('/tasks/:id/edit', isAuthenticated, requirePermission('edit_tasks'), TaskController.getEditView); 
app.get('/tasks/:id', isAuthenticated, TaskController.getByIdView);  
app.post('/tasks', isAuthenticated, requirePermission('create_tasks'), TaskController.createView);        
app.put('/tasks/:id', isAuthenticated, requirePermission('edit_tasks'), TaskController.updateView); 

// Vistas Pug para teams
app.get('/teams', isAuthenticated, TeamController.getAllView);          
app.get('/teams/new', isAuthenticated, TeamController.newView);        
app.get('/teams/:id/edit', isAuthenticated, TeamController.getEditView); 
app.get('/teams/:id', isAuthenticated, TeamController.getByIdView);  
app.post('/teams', isAuthenticated, TeamController.createView);        
app.put('/teams/:id', isAuthenticated, TeamController.updateView); 

// Vistas Pug para team_roles
app.get('/team-roles', isAuthenticated, TeamRolController.getAllView);          
app.get('/team-roles/new', isAuthenticated, TeamRolController.newView);        
app.get('/team-roles/:id/edit', isAuthenticated, TeamRolController.getEditView); 
app.get('/team-roles/:id', isAuthenticated, TeamRolController.getByIdView);  
app.post('/team-roles', isAuthenticated, TeamRolController.createView);        
app.put('/team-roles/:id', isAuthenticated, TeamRolController.updateView); 

// Vistas Pug para time_entries
app.get('/time-entries', isAuthenticated, TimeEntryController.getAllView);          
app.get('/time-entries/new', isAuthenticated, TimeEntryController.newView);        
app.get('/time-entries/:id/edit', isAuthenticated, TimeEntryController.getEditView); 
app.get('/time-entries/:id', isAuthenticated, TimeEntryController.getByIdView);  
app.post('/time-entries', isAuthenticated, TimeEntryController.createView);        
app.put('/time-entries/:id', isAuthenticated, TimeEntryController.updateView); 

// Vistas Pug para positions
app.get('/positions', isAuthenticated, PositionController.getAllView);          
app.get('/positions/new', isAuthenticated, PositionController.newView);        
app.get('/positions/:id/edit', isAuthenticated, PositionController.getEditView); 
app.get('/positions/:id', isAuthenticated, PositionController.getByIdView);  
app.post('/positions', isAuthenticated, PositionController.createView);        
app.put('/positions/:id', isAuthenticated, PositionController.updateView); 

// Vistas Pug para contacts
app.get('/contacts', isAuthenticated, ContactController.getAllView);          
app.get('/contacts/new', isAuthenticated, ContactController.newView);        
app.get('/contacts/:id/edit', isAuthenticated, ContactController.getEditView); 
app.get('/contacts/:id', isAuthenticated, ContactController.getByIdView);  
app.post('/contacts', isAuthenticated, ContactController.createView);        
app.put('/contacts/:id', isAuthenticated, ContactController.updateView); 

// Vistas Pug para Estimates
app.get('/estimates', isAuthenticated, EstimateController.getAllView);          
app.get('/estimates/new', isAuthenticated, EstimateController.newView);        
app.get('/estimates/:id/edit', isAuthenticated, EstimateController.getEditView); 
app.get('/estimates/:id', isAuthenticated, EstimateController.getByIdView);  
app.post('/estimates', isAuthenticated, EstimateController.createView);        
app.put('/estimates/:id', isAuthenticated, EstimateController.updateView); 

// Vistas Pug para Expenses
app.get('/expenses', isAuthenticated, ExpenseController.getAllView);          
app.get('/expenses/new', isAuthenticated, ExpenseController.newView);
app.get('/expenses/:id/edit', isAuthenticated, ExpenseController.getEditView);
app.get('/expenses/:id', isAuthenticated, ExpenseController.getByIdView);  
app.post('/expenses', isAuthenticated, ExpenseController.createView);        
app.put('/expenses/:id', isAuthenticated, ExpenseController.updateView);

// Vistas Pug para Invoices
app.get('/invoices', isAuthenticated, InvoiceController.getAllView);          
app.get('/invoices/new', isAuthenticated, InvoiceController.newView);
app.put('/invoices/:id/generate', isAuthenticated, InvoiceController.generateInvoiceView);
app.get('/invoices/:id/preview', isAuthenticated, InvoiceController.previewInvoiceView);
app.post('/invoices/:id/confirm-generate', isAuthenticated, InvoiceController.confirmGenerateInvoice);
app.get('/invoices/:id/edit', isAuthenticated, InvoiceController.getEditView);
app.get('/invoices/:id', isAuthenticated, InvoiceController.getByIdView);  
app.post('/invoices', isAuthenticated, InvoiceController.createView);        
app.put('/invoices/:id', isAuthenticated, InvoiceController.updateView);
app.put('/invoices/:id/status', isAuthenticated, InvoiceController.updateStatus);

// Vistas Pug para Receipts
app.get('/receipts', isAuthenticated, ReceiptController.getAllView);          
app.get('/receipts/new', isAuthenticated, ReceiptController.newView);
app.get('/receipts/:id/edit', isAuthenticated, ReceiptController.getEditView);
app.get('/receipts/:id', isAuthenticated, ReceiptController.getByIdView);  
app.post('/receipts', isAuthenticated, ReceiptController.createView);        
app.put('/receipts/:id', isAuthenticated, ReceiptController.updateView);
app.put('/receipts/:id/status', isAuthenticated, ReceiptController.updateStatus);

// Vistas Pug para Payments
app.get('/payments', isAuthenticated, PaymentController.getAllView);          
app.get('/payments/new', isAuthenticated, PaymentController.newView);
app.get('/payments/:id/edit', isAuthenticated, PaymentController.getEditView);
app.get('/payments/:id', isAuthenticated, PaymentController.getByIdView);  
app.post('/payments', isAuthenticated, PaymentController.createView);        
app.put('/payments/:id', isAuthenticated, PaymentController.updateView);
app.put('/payments/:id/status', isAuthenticated, PaymentController.updateStatus);

// Vistas Pug para Expense Categories
app.get('/expense-categories', isAuthenticated, ExpenseCategoryController.getAllView);          
app.get('/expense-categories/new', isAuthenticated, ExpenseCategoryController.newView);
app.get('/expense-categories/:id/edit', isAuthenticated, ExpenseCategoryController.getEditView);
app.get('/expense-categories/:id', isAuthenticated, ExpenseCategoryController.getByIdView);  
app.post('/expense-categories', isAuthenticated, ExpenseCategoryController.createView);        
app.put('/expense-categories/:id', isAuthenticated, ExpenseCategoryController.updateView);

// Vistas Pug para Documents
app.get('/document-files', isAuthenticated, DocumentFileController.getAllView);          
app.get('/document-files/new', isAuthenticated, DocumentFileController.newView);
app.get('/document-files/:id/edit', isAuthenticated, DocumentFileController.getEditView);
app.get('/document-files/:id', isAuthenticated, DocumentFileController.getByIdView);  
app.post('/document-files', isAuthenticated, DocumentFileController.createView);        
app.put('/document-files/:id', isAuthenticated, DocumentFileController.updateView);




// || -----------------------------Rutas base (endpoints de la API) ------------------------------||
// Rutas de autenticación API (JWT)
app.use('/api/auth', apiAuthRoutes);

// Rutas de API existentes (sin protección por defecto - pueden protegerse individualmente)
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
app.use('/api/expense-categories', expenseCategoryRoutes);
app.use('/api/receipts', receiptRoutes);
app.use('/api/employees', employeeRoutes);
app.use('/api/document-files', documentFileRoutes);


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
