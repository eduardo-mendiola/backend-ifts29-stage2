import BaseController from './BaseController.js';
import Estimate from '../models/EstimateModel.js';
import Project from '../models/ProjectModel.js';
import User from '../models/UserModel.js';
import { formatDatesForInput } from '../utils/dateHelpers.js';

const statusLabels = {
    draft: 'Borrador',
    sent: 'Enviado',
    viewed: 'Visto',
    accepted: 'Aceptado',
    rejected: 'Rechazado',
    expired: 'Vencido',
    converted: 'Convertido'
};

class EstimateController extends BaseController {
    constructor() {
        super(Estimate, 'estimates', 'EST-');
    }

    // View for editing an estimate
    getEditView = async (req, res) => {
        try {
            const { id } = req.params;
            const estimate = await this.model.findById(id);
            if (!estimate) return res.render('error404', { title: 'Presupuesto no encontrado' });

            const users = await User.findAll();
            const projects = await Project.findAll();

            // Format dates before sending to the view
            const formattedEstimate = formatDatesForInput(
                this.formatItem(estimate),
                ['valid_until', 'updated_at', 'created_at']
            );

            res.render(`${this.viewPath}/edit`, {
                title: `Editar Presupuesto`,
                item: formattedEstimate,
                users,
                projects,
                statusLabels
            });
        } catch (error) {
            console.error('Error en getEditView:', error.message);
            res.status(500).render('error500', { title: 'Error del servidor' });
        }
    };

    // View for creating a new estimate
    newView = async (req, res) => {
        try {
            const users = await User.findAll();
            const projects = await Project.findAll();

            res.render(`${this.viewPath}/new`, {
                title: `Nuevo Presupuesto`,
                item: {},
                users,
                projects,
                statusLabels
            });
        } catch (error) {
            console.error('Error al abrir formulario de presupuestos:', error.message);
            res.status(500).render('error500', { title: 'Error de servidor' });
        }
    };
}

export default new EstimateController();
