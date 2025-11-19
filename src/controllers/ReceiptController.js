import PermissionAwareController from './PermissionAwareController.js';
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

const status_labels = {
    success: 'Exitoso',
    cancelled: 'Cancelado'
};

class ReceiptController extends PermissionAwareController {
    constructor() {
        super(Receipt, 'receipts', 'receipts', 'REC-');
    }

    getAllView = async (req, res) => {
        try {
            const items = await this.model.findAll();
            res.render(`${this.viewPath}/index`, {
                title: `Lista de ${this.viewPath}`,
                items: this.formatItems(items),
                payment_method_labels,
                currency_labels,
                status_labels,

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
                currency_labels,
                status_labels
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
                currency_labels,
                status_labels
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
                currency_labels,
                status_labels
            });
        } catch (error) {
            console.error('Error al abrir formulario de cobro:', error.message);
            res.status(500).render('error500', { title: 'Error de servidor' });
        }
    };

    createView = async (req, res) => {
        try {
            const data = req.body;
            const { invoice_id } = data;

            console.log('Invoice ID recibido:', invoice_id); // Debug

            // Verificar que la factura existe y está en estado "generated"
            const invoice = await Invoice.findById(invoice_id);
            console.log('Factura encontrada:', invoice); // Debug

            if (!invoice) {
                return res.status(404).render('error404', { title: 'Factura no encontrada' });
            }

            console.log('Estado actual de la factura:', invoice.status); // Debug

            if (invoice.status !== 'generated') {
                return res.status(400).render('error', {
                    title: 'Error',
                    message: 'Solo se pueden crear cobros para facturas generadas'
                });
            }

            // Crear el cobro
            const newReceipt = await this.model.create(data);
            console.log('Cobro creado:', newReceipt); // Debug

            // Generar código definitivo (igual que en InvoiceController)
            if (this.codePrefix) {
                const receiptCode = this.codeGenerator.generateCodeFromId(newReceipt._id, this.codePrefix);
                await this.model.update(newReceipt._id, { code: receiptCode });
                newReceipt.code = receiptCode;
            }

            // Cambiar el status de la factura a "paid"
            console.log('Cambiando status de factura...'); // Debug
            invoice.status = 'paid';
            const savedInvoice = await invoice.save();
            console.log('Factura actualizada:', savedInvoice); // Debug

            console.log(`Cobro ${newReceipt.code} creado y factura ${invoice.invoice_number} marcada como pagada`);

            // Redirigir a la lista de cobros
            return res.redirect('/receipts/');

        } catch (error) {
            console.error('Error creando cobro:', error.message);
            console.error('Stack:', error.stack); // Más detalles del error
            return res.status(500).render('error500', { title: 'Error al crear cobro' });
        }
    };


    updateStatus = async (req, res) => {
        try {
            const { id } = req.params;
            const { status } = req.body;

            const receipt = await this.model.findById(id);
            if (!receipt) {
                return res.status(404).json({ message: 'Cobro no encontrado' });
            }

            // Validación de negocio - solo verificar si ya está cancelado
            if (receipt.status === 'cancelled') {
                return res.status(400).json({ message: 'El cobro ya está anulado.' });
            }

            // Aplicar cancelación - solo permitir cambio a cancelled
            if (status === 'cancelled') {
                // Obtener la factura asociada al cobro
                const invoice = await Invoice.findById(receipt.invoice_id);
                if (!invoice) {
                    return res.status(404).json({ message: 'Factura asociada no encontrada' });
                }

                console.log('Anulando cobro y restaurando factura...'); // Debug

                // Cambiar el status del cobro a cancelled
                receipt.status = 'cancelled';
                await receipt.save();

                // Cambiar el status de la factura de "paid" a "generated"
                invoice.status = 'generated';
                const savedInvoice = await invoice.save();

                console.log(`Cobro ${receipt.code} anulado y factura ${invoice.invoice_number} restaurada a generada`);
                console.log('Factura actualizada:', savedInvoice); // Debug

            } else {
                return res.status(400).json({ message: 'Solo se permite anular cobros.' });
            }

            return res.redirect('/receipts/');

        } catch (error) {
            console.error('Error cambiando estado del cobro:', error.message);
            console.error('Stack:', error.stack); // Más detalles del error
            return res.status(500).render('error500', { title: 'Error al cambiar estado' });
        }
    };



}

export default new ReceiptController();