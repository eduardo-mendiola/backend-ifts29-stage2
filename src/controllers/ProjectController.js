import BaseController from './BaseController.js'
import Project from '../models/ProjectModel.js'; 
import Client from '../models/ClientModel.js';
import Team from '../models/TeamModel.js';

class ProjectController extends BaseController {
    constructor() {
        super(Project, 'project'); 
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
            start_date: formatDate(item.start_date),
            end_date: formatDate(item.end_date)
        };
    }

    // Sobrescribimos getEditView para incluir roles y áreas
    getEditView = async (req, res) => {
        try {
            const { id } = req.params;
            const project = await this.model.findById(id);
            if (!project) return res.render('error404', { title: 'Proyecto no encontrado' });

            const clients = await Client.findAll(); 
            const teams = await Team.findAll();

            // Formatear fechas antes de enviar a la vista
            const formattedProject = this.formatDatesForInput(this.formatItem(project));

            res.render(`${this.viewPath}/edit`, {
                title: `Editar Proyecto`,
                item: formattedProject, // Proyecto con fechas formateadas
                clients,
                teams
            });
        } catch (error) {
            console.error('Error en getEditView:', error.message);
            res.status(500).render('error500', { title: 'Error del servidor' });
        }
    };

    newView = async (req, res) => {
        try {
            const clients = await Client.findAll();
            const teams = await Team.findAll();

            res.render(`${this.viewPath}/new`, {
                title: `Nuevo Proyecto`,
                item: {}, // objeto vacío porque es nuevo
                clients,
                teams
            });
        } catch (error) {
            console.error('Error al abrir formulario de proyecto:', error.message);
            res.status(500).render('error500', { title: 'Error de servidor' });
        }
    };
}

export default new ProjectController();