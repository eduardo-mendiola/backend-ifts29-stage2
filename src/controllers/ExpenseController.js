import BaseController from './BaseController.js';
import Expense from '../models/ExpenseModel.js';
import Project from '../models/ProjectModel.js';
import Client from '../models/ClientModel.js';
import { formatDatesForInput } from '../utils/dateHelpers.js';

const statusLabels = {
    pending: 'Pendiente',
    approved: 'Aprobado',
    rejected: 'Rechazado'
};

const paiment_method_labels = {
    credit_card: 'Tarjeta de crédito',
    cash: 'Efectivo',
    bank_transfer: 'Transferencia bancaria'
};

const currency_labels = {
    USD: 'Dólar estadounidense',
    EUR: 'Euro',
    GBP: 'Libra esterlina',
    ARG: 'Peso argentino'
};

class ExpenseController extends BaseController {
    constructor() {
        super(Expense, 'expenses', 'EXP-');
    }

    getAllView = async (req, res) => {
        try {
            const items = await this.model.findAll();
            res.render(`${this.viewPath}/index`, {
                title: `Lista de ${this.viewPath}`,
                items: this.formatItems(items),
                statusLabels,
                paiment_method_labels,
                currency_labels
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
            const expense = await this.model.findById(id);
            if (!expense) return res.render('error404', { title: 'Gasto no encontrado' });

            // Format dates before sending to the view
            const formattedExpense = formatDatesForInput(
                this.formatItem(estimate),
                ['valid_until', 'updated_at', 'created_at']
            );

            res.render(`${this.viewPath}/show`, {
                title: `Ver Presupuesto`,
                item: formattedExpense,
                statusLabels,
                paiment_method_labels,
                currency_labels
            });

        } catch (error) {
            console.error('Error en getByIdView:', error.message);
            res.status(500).render('error500', { title: 'Error del servidor' });
        }
    };

    // View for editing an estimate
    getEditView = async (req, res) => {
        try {
            const { id } = req.params;
            const estimate = await this.model.findById(id);
            if (!estimate) return res.render('error404', { title: 'Gasto no encontrado' });

            const clients = await Client.findAll();
            const projects = await Project.findAll();

            // Format dates before sending to the view
            const formattedExpense = formatDatesForInput(
                this.formatItem(estimate),
                ['date', 'updated_at', 'created_at']
            );

            res.render(`${this.viewPath}/edit`, {
                title: `Editar Presupuesto`,
                item: formattedExpense,
                clients,
                projects,
                statusLabels,
                paiment_method_labels,
                currency_labels
            });
        } catch (error) {
            console.error('Error en getEditView:', error.message);
            res.status(500).render('error500', { title: 'Error del servidor' });
        }
    };

    // View for creating a new estimate
    newView = async (req, res) => {
        try {
            const clients = await Client.findAll();
            const projects = await Project.findAll();

            res.render(`${this.viewPath}/new`, {
                title: `Nuevo Gasto`,
                item: {},
                clients,
                projects,
                statusLabels,
                paiment_method_labels,
                currency_labels
            });
        } catch (error) {
            console.error('Error al abrir formulario de gastos:', error.message);
            res.status(500).render('error500', { title: 'Error de servidor' });
        }
    };
}

export default new ExpenseController();
