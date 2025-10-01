import BaseController from './BaseController.js'
import TimeEntry from '../models/TimeEntryModel.js';
import Task from '../models/TaskModel.js';
import User from '../models/UserModel.js';
import { filterManagers } from '../utils/userHelpers.js';
import { formatDatesForInput } from '../utils/dateHelpers.js';

class TimeEntryController extends BaseController {
    constructor() {
        super(TimeEntry, 'time-entries');
    }

    // Sobrescribimos getEditView para incluir usuarios y tareas
    getEditView = async (req, res) => {
        try {
            const { id } = req.params;
            const time_entry = await this.model.findById(id);
            if (!time_entry) return res.render('error404', { title: 'Registro no encontrado' });

            const users = await User.findAll();
            const tasks = await Task.findAll();
            const approved_by = await User.findAll();
            const managers = filterManagers(approved_by);

            // Formatear fechas antes de enviar a la vista
            const formattedTimeEntry = formatDatesForInput(this.formatItem(time_entry), ['date']);

            res.render(`${this.viewPath}/edit`, {
                title: `Editar Time Entry: ${formattedTimeEntry.code}`,
                item: formattedTimeEntry, // Tarea con fecha formateada
                users,
                tasks,
                managers
               
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