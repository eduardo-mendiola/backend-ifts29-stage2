import PermissionAwareController from './PermissionAwareController.js';
import Task from '../models/TaskModel.js';
import Project from '../models/ProjectModel.js';
import Employee from '../models/EmployeeModel.js';
import { formatDatesForInput } from '../utils/dateHelpers.js';
import CodeGenerator from '../utils/CodeGenerator.js';

const statusLabels = {
    pending: 'Pendiente',
    in_progress: 'En Progreso',
    completed: 'Completado'
};

class TaskController extends PermissionAwareController {
    constructor() {
        super(Task, 'tasks', 'tasks', 'TSK-');
        this.codeGenerator = new CodeGenerator(Task);
    }

    getAllView = async (req, res) => {
        try {
            const userId = req.user?._id || req.session?.user?._id;
            const user = req.user || req.session?.user;
            console.log('Usuario:', user.username, 'userId:', userId);
            console.log('Tiene view_all_tasks?', this.checkPermission(req, 'view_all_tasks'));
            
            let items;
            
            // Si tiene permiso view_all_tasks, ver todas las tareas
            if (this.checkPermission(req, 'view_all_tasks')) {
                console.log('Mostrando TODAS las tareas');
                items = await this.model.findAll();
            } else {
                // Si no, solo ver tareas de sus proyectos
                console.log('Filtrando tareas por proyectos del usuario');
                items = await this.model.findByUserProjects(userId);
                console.log('Tareas filtradas:', items.length);
            }
            
            res.render(`${this.viewPath}/index`, {
                title: `Lista de ${this.viewPath}`,
                items: this.formatItems(items),
                statusLabels,
            });
        } catch (error) {
            console.error(`Error al obtener todos en vista (${this.viewPath}):`, error.message);
            res.render('error500', { title: 'Error de servidor' });
        }
    };

    // View for displaying an estimate by ID (for show.pug)
    getByIdView = async (req, res) => {
        try {
            const { id } = req.params;
            const task = await this.model.findById(id);
            if (!task) return res.render('error404', { title: 'Tarea no encontrada' });

            // Format dates before sending to the view
            const formattedTask = formatDatesForInput(
                this.formatItem(task),
                ['due_date', 'updated_at', 'created_at']
            );

            res.render(`${this.viewPath}/show`, {
                title: `Ver Tarea`,
                item: formattedTask,
                statusLabels,
            });

        } catch (error) {
            console.error('Error en getByIdView:', error.message);
            res.status(500).render('error500', { title: 'Error del servidor' });
        }
    };

    // Sobrescribimos getEditView para incluir usuarios y proyectos
    getEditView = async (req, res) => {
        try {
            const { id } = req.params;
            const task = await this.model.findById(id);
            if (!task) return res.render('error404', { title: 'Tarea no encontrado' });

            const employees = await Employee.findAll();
            const projects = await Project.findAll();

            // Formatear fechas antes de enviar a la vista
            const formattedTask = formatDatesForInput(this.formatItem(task), ['due_date', 'created_at']);

            res.render(`${this.viewPath}/edit`, {
                title: `Editar Task`,
                item: formattedTask, // Tarea con fecha formateada
                employees,
                projects
            });
        } catch (error) {
            console.error('Error en getEditView:', error.message);
            res.status(500).render('error500', { title: 'Error del servidor' });
        }
    };

    newView = async (req, res) => {
        try {
            const employees = await Employee.findAll();
            const projects = await Project.findAll();

            res.render(`${this.viewPath}/new`, {
                title: `Nueva Tarea`,
                item: {}, // objeto vacío porque es nuevo
                employees,
                projects
            });
        } catch (error) {
            console.error('Error al abrir formulario de tareas:', error.message);
            res.status(500).render('error500', { title: 'Error de servidor' });
        }
    };

    createView = async (req, res) => {
        try {
            const newItem = { ...req.body };
            
            // Agregar el usuario que está creando la tarea
            const userId = req.user?._id || req.session?.user?._id;
            console.log('Usuario creando tarea:', userId);
            if (userId) {
                newItem.assigned_by = userId;
            }

            console.log('Datos a crear:', newItem);

            // 1. Crear el documento SIN el código
            const createdItem = await this.model.create(newItem);
            console.log('Tarea creada:', createdItem);

            // 2. Generar el código usando el ObjectId real del documento creado
            if (this.codePrefix) {
                const code = this.codeGenerator.generateCodeFromId(createdItem._id, this.codePrefix);
                // 3. Actualizar el documento con el código correcto
                await this.model.update(createdItem._id, { code });
            }

            res.redirect(`/${this.viewPath}/${createdItem._id}`);
        } catch (error) {
            console.error(`Error al crear ${this.viewPath}:`, error.message);
            console.error('Stack:', error.stack);
            res.status(500).render('error500', { title: 'Error de servidor' });
        }
    };
}

export default new TaskController();