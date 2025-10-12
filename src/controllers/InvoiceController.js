import BaseController from './BaseController.js';
import Invoice from '../models/InvoiceModel.js';
import Project from '../models/ProjectModel.js';
import Client from '../models/ClientModel.js';
import User from '../models/UserModel.js';
import ExpenseCategory from '../models/ExpenseCategoryModel.js';
import { formatDatesForInput } from '../utils/dateHelpers.js';

const statusLabels = {
    draft: 'Borrador',
    sent: 'Enviada',
    paid: 'Pagada',
    overdue: 'Vencida',
    cancelled: 'Cancelada'
};

const payment_method_labels = {
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

class InvoiceController extends BaseController {
    constructor() {
        super(Invoice, 'invoices', 'EXP-');
    }

    getAllView = async (req, res) => {
        try {
            const items = await this.model.findAll();
            res.render(`${this.viewPath}/index`, {
                title: `Lista de ${this.viewPath}`,
                items: this.formatItems(items),
                statusLabels,
                payment_method_labels,
                currency_labels
            });
        } catch (error) {
            console.error(`Error al obtener todos en vista (${this.viewPath}):`, error.message);
            res.render('error500', { title: 'Error de servidor' });
        }
    };

    // View for displaying an invoice by ID (for show.pug)
    getByIdView = async (req, res) => {
        try {
            const { id } = req.params;
            const invoice = await this.model.findById(id);
            if (!invoice) return res.render('error404', { title: 'Gasto no encontrado' });

            // Format dates before sending to the view
            const formattedExpense = formatDatesForInput(
                this.formatItem(invoice),
                ['date', 'updated_at', 'created_at']
            );

            res.render(`${this.viewPath}/show`, {
                title: `Ver Presupuesto`,
                item: formattedExpense,
                statusLabels,
                payment_method_labels,
                currency_labels
            });

        } catch (error) {
            console.error('Error en getByIdView:', error.message);
            res.status(500).render('error500', { title: 'Error del servidor' });
        }
    };

    // View for editing an invoice
    getEditView = async (req, res) => {
        try {
            const { id } = req.params;
            const invoice = await this.model.findById(id);
            if (!invoice) return res.render('error404', { title: 'Gasto no encontrado' });

            const clients = await Client.findAll();
            const projects = await Project.findAll();
            const users = await User.findAll();
            const categories = await ExpenseCategory.findAll();

            // Format dates before sending to the view
            const formattedExpense = formatDatesForInput(
                this.formatItem(invoice),
                ['date', 'updated_at', 'created_at']
            );

            res.render(`${this.viewPath}/edit`, {
                title: `Editar Presupuesto`,
                item: formattedExpense,
                clients,
                projects,
                users,
                categories,
                statusLabels,
                payment_method_labels,
                currency_labels
            });
        } catch (error) {
            console.error('Error en getEditView:', error.message);
            res.status(500).render('error500', { title: 'Error del servidor' });
        }
    };

    // View for creating a new invoice
    newView = async (req, res) => {
        try {
            const clients = await Client.findAll();
            const projects = await Project.findAll();
            const users = await User.findAll();
            const categories = await ExpenseCategory.findAll();

            res.render(`${this.viewPath}/new`, {
                title: `Nuevo Gasto`,
                item: {},
                clients,
                projects,
                users,
                categories,
                statusLabels,
                payment_method_labels,
                currency_labels
            });
        } catch (error) {
            console.error('Error al abrir formulario de gastos:', error.message);
            res.status(500).render('error500', { title: 'Error de servidor' });
        }
    };
}

export default new InvoiceController();
