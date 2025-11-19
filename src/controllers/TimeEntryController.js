import PermissionAwareController from './PermissionAwareController.js';
import TimeEntry from '../models/TimeEntryModel.js';
import Task from '../models/TaskModel.js';
import Employee from '../models/EmployeeModel.js';
import { filterManagers } from '../utils/userHelpers.js';
import { formatDatesForInput } from '../utils/dateHelpers.js';

class TimeEntryController extends PermissionAwareController {
    constructor() {
        super(TimeEntry, 'time-entries', 'time_entries', 'TIM-');
    }

    getAllView = async (req, res) => {
        try {
            const userId = req.user?._id || req.session?.user?._id;
            let items;
            
            // Si tiene permiso view_all_time_entries, ver todas
            if (this.checkPermission(req, 'view_all_time_entries')) {
                items = await this.model.findAll();
            } else {
                // Si no, solo ver sus propios registros
                items = await this.model.findByUserProjects(userId);
            }
            
            res.render(`${this.viewPath}/index`, {
                title: `Lista de ${this.viewPath}`,
                items: this.formatItems(items)
            });
        } catch (error) {
            console.error(`Error al obtener todos en vista (${this.viewPath}):`, error.message);
            res.render('error500', { title: 'Error de servidor' });
        }
    };

    // Sobrescribimos createView para actualizar la tarea correspondiente
    createView = async (req, res) => {
        try {
            const userId = req.user?._id || req.session?.user?._id;
            
            // Buscar el empleado asociado al usuario logueado
            const employee = await Employee.model.findOne({ user_id: userId });
            if (!employee) {
                return res.status(400).render('error500', { 
                    title: 'Error', 
                    message: 'No se encontró un empleado asociado al usuario' 
                });
            }
            
            // Asignar automáticamente el employee_id del usuario logueado
            const newEntry = { 
                ...req.body, 
                employee_id: employee._id 
            };
            
            const createdEntry = await this.model.create(newEntry);

            // Generar el código si aplica
            if (this.codePrefix) {
                const code = this.codeGenerator.generateCodeFromId(createdEntry._id, this.codePrefix);
                await this.model.update(createdEntry._id, { code });
            }

            // Agregar el time_entry a la tarea correspondiente
            await Task.update(
                createdEntry.task_id,
                { $push: { time_entries_ids: createdEntry._id } }
            );

            res.redirect(`/${this.viewPath}/${createdEntry._id}`);
        } catch (error) {
            console.error(`Error al crear ${this.viewPath}:`, error.message);
            res.status(500).render('error500', { title: 'Error de servidor' });
        }
    };

    // Sobrescribimos updateView para manejar cambio de tarea
    updateView = async (req, res) => {
        try {
            const { id } = req.params;
            const oldEntry = await this.model.findById(id);
            if (!oldEntry) return res.render('error404', { title: `${this.viewPath} no encontrado para actualizar.` });

            // Remover employee_id del body para que no se pueda cambiar
            const { employee_id, ...updateData } = req.body;
            
            const updatedEntry = await this.model.update(id, updateData);

            // Si cambió la tarea, mover el entry
            if (oldEntry.task_id.toString() !== updatedEntry.task_id.toString()) {
                // Quitar de la tarea anterior
                await Task.update(
                    oldEntry.task_id,
                    { $pull: { time_entries_ids: oldEntry._id } }
                );

                // Agregar a la nueva tarea
                await Task.update(
                    updatedEntry.task_id,
                    { $push: { time_entries_ids: updatedEntry._id } }
                );
            }

            res.redirect(`/${this.viewPath}/${id}`);
        } catch (error) {
            console.error(`Error al actualizar ${this.viewPath}:`, error.message);
            res.status(500).render('error500', { title: 'Error de servidor' });
        }
    };

    // Sobrescribimos getEditView para incluir usuarios y tareas
    getEditView = async (req, res) => {
        try {
            const { id } = req.params;
            const time_entry = await this.model.findById(id);
            if (!time_entry) return res.render('error404', { title: 'Registro no encontrado' });

            const tasks = await Task.findAll();
            const approved_by = await Employee.findAll();
            const managers = filterManagers(approved_by);

            const formattedTimeEntry = formatDatesForInput(this.formatItem(time_entry), ['date']);

            res.render(`${this.viewPath}/edit`, {
                title: `Editar Time Entry: ${formattedTimeEntry.code}`,
                item: formattedTimeEntry,
                tasks,
                managers
            });
        } catch (error) {
            console.error('Error en getEditView:', error.message);
            res.status(500).render('error500', { title: 'Error del servidor' });
        }
    };

    // Sobrescribimos newView para pasar usuarios y tareas
    newView = async (req, res) => {
        try {
            const userId = req.user?._id || req.session?.user?._id;
            const currentEmployee = await Employee.model.findOne({ user_id: userId });
            
            const tasks = await Task.findAll();
            const approved_by = await Employee.findAll();
            const managers = filterManagers(approved_by);

            res.render(`${this.viewPath}/new`, {
                title: `Nueva Tarea`,
                item: {},
                currentEmployee: currentEmployee ? this.formatItem(currentEmployee) : null,
                tasks,
                managers
            });
        } catch (error) {
            console.error('Error al abrir formulario de tareas:', error.message);
            res.status(500).render('error500', { title: 'Error de servidor' });
        }
    };


    delete = async (req, res) => {
        try {
            const { id } = req.params;

            // 1️ Buscar el time entry que queremos eliminar
            const entryToDelete = await this.model.findById(id);
            if (!entryToDelete) {
                return res.status(404).json({ message: 'TimeEntry no encontrado.' });
            }

            // 2️ Eliminar el time entry
            await this.model.delete(id);

            // 3️ Quitar la referencia del array de la tarea correspondiente
            if (entryToDelete.task_id) {
                await Task.update(
                    entryToDelete.task_id,
                    { $pull: { time_entries_ids: entryToDelete._id } }
                );
            }

            // 4️ Responder correctamente
            res.status(204).send(); // 204 = No Content, típico para delete
        } catch (error) {
            console.error(`Error al eliminar TimeEntry ${req.params.id}:`, error.message);
            res.status(500).json({ message: 'Error interno del servidor al eliminar TimeEntry.' });
        }
    };




}




export default new TimeEntryController();


