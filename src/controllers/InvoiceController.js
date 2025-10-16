import BaseController from './BaseController.js';
import Invoice from '../models/InvoiceModel.js';
import Project from '../models/ProjectModel.js';
import Client from '../models/ClientModel.js';
import Estimate from '../models/EstimateModel.js';
import { formatDatesForInput } from '../utils/dateHelpers.js';
import { calculateInvoiceTotals, calculateBalanceDue } from '../utils/invoiceHelpers.js';
import { invoiceNumberGenerator } from '../utils/invoiceNumberGenerator.js';

const statusLabels = {
    draft: 'Borrador',
    sent: 'Enviada',
    paid: 'Pagada',
    overdue: 'Vencida',
    cancelled: 'Cancelada'
};

const currency_labels = {
    USD: 'Dólar estadounidense',
    EUR: 'Euro',
    GBP: 'Libra esterlina',
    ARG: 'Peso argentino'
};

const invoiceTypes = ['A', 'B', 'C', 'E'];

class InvoiceController extends BaseController {
    constructor() {
        super(Invoice, 'invoices', 'INV-');
    }

    getAllView = async (req, res) => {
        try {
            const items = await this.model.findAll();
            res.render(`${this.viewPath}/index`, {
                title: `Lista de ${this.viewPath}`,
                items: this.formatItems(items),
                statusLabels,
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
            if (!invoice) return res.render('error404', { title: 'Factura no encontrada' });

            // Format dates before sending to the view
            const formattedInvoice = formatDatesForInput(
                this.formatItem(invoice),
                ['issue_date', 'due_date', 'updated_at', 'created_at']
            );

            res.render(`${this.viewPath}/show`, {
                title: `Ver Factura`,
                item: formattedInvoice,
                statusLabels,
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
            if (!invoice) return res.render('error404', { title: 'Factura no encontrada' });

            const estimate = await Estimate.findById(invoice.estimate_id);
            if (!estimate) return res.render('error404', { title: 'Presupuesto asociado no encontrado' });

            const clients = await Client.findAll();
            const projects = await Project.findAll();

            const { subtotal, discount, taxes, total } = calculateInvoiceTotals(
                estimate.total_amount,
                invoice.discount_percent,
                invoice.tax_percent
            );

            const balance_due = calculateBalanceDue(total, invoice.paid_amount || 0);

            const formattedInvoice = formatDatesForInput(
                this.formatItem(invoice),
                ['issue_date', 'due_date', 'updated_at', 'created_at']
            );

            res.render(`${this.viewPath}/edit`, {
                title: 'Editar Factura',
                item: formattedInvoice,
                invoiceTypes,
                clients,
                projects,
                statusLabels,
                currency_labels,
                subtotal,
                discount,
                taxes,
                total_amount: total,
                paid_amount: invoice.paid_amount || 0,
                balance_due,
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

            const { subtotal, discount, taxes, total } = calculateInvoiceTotals(
                req.body.items,
                req.body.discount_percent,
                req.body.tax_percent
            );

            const nextInvoiceNumber = await invoiceNumberGenerator();

            const balance_due = calculateBalanceDue(total, req.body.paid_amount || 0);

            res.render(`${this.viewPath}/new`, {
                title: `Nueva Factura`,
                item: {},
                invoice_number: nextInvoiceNumber,
                invoiceTypes,
                clients,
                projects,
                statusLabels,
                currency_labels,
                subtotal,
                discount,
                taxes,
                total_amount: total,
                paid_amount: 0,
                balance_due: total,
            });
        } catch (error) {
            console.error('Error al abrir formulario de Facturas:', error.message);
            res.status(500).render('error500', { title: 'Error de servidor' });
        }
    };


    // Update an invoice (overrides BaseController logic)
    updateView = async (req, res) => {
        try {
            const { id } = req.params;
            const invoice = await this.model.findById(id);
            if (!invoice) {
                return res.status(404).json({ message: 'Factura no encontrada' });
            }

            // Si la factura está en draft, se pueden modificar todos los campos
            if (invoice.status === 'draft') {
                Object.assign(invoice, req.body);

                // Mientras esté en draft, el número de factura es "pendiente"
                if (!invoice.invoice_number || invoice.invoice_number === '') {
                    invoice.invoice_number = 'pendiente';
                }

            } else {
                // Si no está en draft, solo puede cambiar el estado
                if (req.body.status) {
                    invoice.status = req.body.status;

                    // Si el middleware detectó cambio a "sent", generamos número
                    if (req.generateInvoiceNumber && invoice.invoice_number === 'pendiente') {
                        invoice.invoice_number = await invoiceNumberGenerator();
                    }

                } else {
                    return res.status(400).json({
                        message: 'Solo se puede modificar el estado una vez que sale del borrador.'
                    });
                }
            }

            await invoice.save();
            res.redirect(`/invoices/${invoice._id}`);

        } catch (error) {
            console.error('Error al actualizar factura:', error.message);
            res.status(500).render('error500', { title: 'Error al actualizar factura' });
        }
    };



}

export default new InvoiceController();
