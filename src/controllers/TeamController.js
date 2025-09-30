import BaseController from './BaseController.js';
import Team from '../models/TeamModel.js';
import User from '../models/UserModel.js';

class TeamController extends BaseController {
    constructor() {
        super(Team, 'team'); 
    }

    // Método helper para formatear fechas (para inputs de tipo date)
    formatDatesForInput = (item) => {
        const formatDate = (date) => {
            if (!date) return '';
            const d = new Date(date);
            return d.toISOString().split('T')[0]; // YYYY-MM-DD
        };

        return {
            ...item,
            created_at: formatDate(item.created_at),
            updated_at: formatDate(item.updated_at)
        };
    }

    // Vista de edición de un equipo
    getEditView = async (req, res) => {
        try {
            const { id } = req.params;
            const team = await this.model.findById(id);
            if (!team) return res.render('error404', { title: 'Equipo no encontrado' });

            const users = await User.findAll();

            const formattedTeam = this.formatDatesForInput(this.formatItem(team));

            res.render(`${this.viewPath}/edit`, {
                title: `Editar Equipo`,
                item: formattedTeam,
                users
            });
        } catch (error) {
            console.error('Error en getEditView:', error.message);
            res.status(500).render('error500', { title: 'Error del servidor' });
        }
    };

    // Vista de nuevo equipo
    newView = async (req, res) => {
        try {
            const users = await User.findAll();

            res.render(`${this.viewPath}/form`, {
                title: `Nuevo Equipo`,
                item: {},
                users
            });
        } catch (error) {
            console.error('Error al abrir formulario de equipos:', error.message);
            res.status(500).render('error500', { title: 'Error de servidor' });
        }
    };
}

export default new TeamController();
