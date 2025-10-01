import BaseController from './BaseController.js'
import Task from '../models/TaskModel.js';
import Project from '../models/ProjectModel.js'; 
import User from '../models/UserModel.js';
import { formatDatesForInput } from '../utils/dateHelpers.js';

class TaskController extends BaseController {
    constructor() {
        super(Task, 'tasks'); 
    }

    // Sobrescribimos getEditView para incluir usuarios y proyectos
    getEditView = async (req, res) => {
        try {
            const { id } = req.params;
            const task = await this.model.findById(id);
            if (!task) return res.render('error404', { title: 'Tarea no encontrado' });

            const users = await User.findAll();
            const projects = await Project.findAll();

            // Formatear fechas antes de enviar a la vista
            const formattedTask = formatDatesForInput(this.formatItem(task), ['due_date', 'created_at']);

            res.render(`${this.viewPath}/edit`, {
                title: `Editar Task`,
                item: formattedTask, // Tarea con fecha formateada
                users,
                projects
            });
        } catch (error) {
            console.error('Error en getEditView:', error.message);
            res.status(500).render('error500', { title: 'Error del servidor' });
        }
    };

    newView = async (req, res) => {
        try {
            const users = await User.findAll();
            const projects = await Project.findAll();

            res.render(`${this.viewPath}/new`, {
                title: `Nueva Tarea`,
                item: {}, // objeto vacío porque es nuevo
                users,
                projects
            });
        } catch (error) {
            console.error('Error al abrir formulario de tareas:', error.message);
            res.status(500).render('error500', { title: 'Error de servidor' });
        }
    };
}

export default new TaskController();