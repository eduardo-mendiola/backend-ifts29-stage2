import BaseController from './BaseController.js'
import Receipt from '../models/ReceiptModel.js';
import Project from '../models/ProjectModel.js';
import Invoice from '../models/InvoiceModel.js';
import Client from '../models/ClientModel.js';
import Estimate from '../models/EstimateModel.js';
import { formatDatesForInput } from '../utils/dateHelpers.js';

const payment_method_labels = {
    bank_transfer: 'Transferencia Bancaria',
    credit_card: 'Tarjeta de Crédito',
    cash: 'Efectivo',
    check: 'Cheque',
    paypal: 'PayPal'
};

const currency_labels = {
    USD: 'Dólar estadounidense',
    EUR: 'Euro',
    GBP: 'Libra esterlina',
    ARG: 'Peso argentino'
};

class ReceiptController extends BaseController {
    constructor() {
        super(Receipt, 'receipts', 'REC-');
    }

    getAllView = async (req, res) => {
        try {
            const items = await this.model.findAll();
            res.render(`${this.viewPath}/index`, {
                title: `Lista de ${this.viewPath}`,
                items: this.formatItems(items),
                payment_method_labels,
                currency_labels
            });
        } catch (error) {
            console.error(`Error al obtener todos en vista (${this.viewPath}):`, error.message);
            res.render('error500', { title: 'Error de servidor' });
        }
    };

    // View for displaying an receipt by ID (for show.pug)
    getByIdView = async (req, res) => {
        try {
            const { id } = req.params;
            const receipt = await this.model.findById(id);
            if (!receipt) return res.render('error404', { title: 'Cobro no encontrado' });

            // Format dates before sending to the view
            const formattedReceipt = formatDatesForInput(
                this.formatItem(receipt),
                ['payment_date', 'updated_at', 'created_at']
            );

            res.render(`${this.viewPath}/show`, {
                title: `Ver Cobro`,
                item: formattedReceipt,
                payment_method_labels,
                currency_labels
            });

        } catch (error) {
            console.error('Error en getByIdView:', error.message);
            res.status(500).render('error500', { title: 'Error del servidor' });
        }
    };

    // View for editing an receipt
    getEditView = async (req, res) => {
        try {
            const { id } = req.params;
            const receipt = await this.model.findById(id);
            if (!receipt) return res.render('error404', { title: 'Cobro no encontrado' });

            const clients = await Client.findAll();
            const projects = await Project.findAll();
            const invoices = await Invoice.findAll();
            const estimates = await Estimate.findAll();

            // Format dates before sending to the view
            const formattedReceipt = formatDatesForInput(
                this.formatItem(receipt),
                ['payment_date', 'updated_at', 'created_at']
            );

            res.render(`${this.viewPath}/edit`, {
                title: `Editar Cobro`,
                item: formattedReceipt,
                clients,
                projects,
                invoices,
                estimates,
                payment_method_labels,
                currency_labels
            });
        } catch (error) {
            console.error('Error en getEditView:', error.message);
            res.status(500).render('error500', { title: 'Error del servidor' });
        }
    };

    // View for creating a new receipt
    newView = async (req, res) => {
        try {
            const clients = await Client.findAll();
            const projects = await Project.findAll();
            const invoicesAll = await Invoice.findAll();
            const estimates = await Estimate.findAll();

            // Filtrar solo las facturas con status "generated"
            const invoices = invoicesAll.filter(inv => inv.status === 'generated');

            res.render(`${this.viewPath}/new`, {
                title: `Nuevo Cobro`,
                item: {},
                clients,
                projects,
                invoices,
                estimates,
                payment_method_labels,
                currency_labels
            });
        } catch (error) {
            console.error('Error al abrir formulario de cobro:', error.message);
            res.status(500).render('error500', { title: 'Error de servidor' });
        }
    };
}

export default new ReceiptController();