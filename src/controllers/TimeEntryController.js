import BaseController from './BaseController.js'
import TimeEntry from '../models/TimeEntryModel.js';
import Task from '../models/TaskModel.js';
import User from '../models/UserModel.js';

class TimeEntryController extends BaseController {
    constructor() {
        super(TimeEntry, 'time-entry');
    }

    // Método helper para formatear fechas
    formatDatesForInput = (item) => {
        const formatDate = (date) => {
            if (!date) return '';
            const d = new Date(date);
            return d.toISOString().split('T')[0]; // Convierte a YYYY-MM-DD
        };

        return {
            ...item,
            due_date: formatDate(item.due_date),
            created_at: formatDate(item.created_at)
        };
    }

    // Sobrescribimos getEditView para incluir usuarios y tareas
    getEditView = async (req, res) => {
        try {
            const { id } = req.params;
            const task = await this.model.findById(id);
            if (!task) return res.render('error404', { title: 'Tarea no encontrado' });

            const users = await User.findAll();
            const tasks = await Task.findAll();

            // Formatear fechas antes de enviar a la vista
            const formattedTask = this.formatDatesForInput(this.formatItem(task));

            res.render(`${this.viewPath}/edit`, {
                title: `Editar Time Entry: ${formattedTask.title}`,
                item: formattedTask, // Tarea con fecha formateada
                users,
                tasks
            });
        } catch (error) {
            console.error('Error en getEditView:', error.message);
            res.status(500).render('error500', { title: 'Error del servidor' });
        }
    };


    newView = async (req, res) => {
        try {
            const users = await User.findAll();
            const tasks = await Task.findAll();

            res.render(`${this.viewPath}/new`, {
                title: `Nueva Tarea`,
                item: {}, // objeto vacío porque es nuevo
                users,
                tasks
            });
        } catch (error) {
            console.error('Error al abrir formulario de tareas:', error.message);
            res.status(500).render('error500', { title: 'Error de servidor' });
        }
    };
}

export default new TimeEntryController();