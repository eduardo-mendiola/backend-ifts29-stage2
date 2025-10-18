import BaseController from './BaseController.js';
import Invoice from '../models/InvoiceModel.js';
import Client from '../models/ClientModel.js';
import Estimate from '../models/EstimateModel.js';
import mongoose from 'mongoose';
import { formatDatesForInput } from '../utils/dateHelpers.js';
import { calculateInvoiceTotals, calculateBalanceDue } from '../utils/invoiceHelpers.js';
import { getNextInvoiceNumberPreview, invoiceNumberGenerator } from '../utils/invoiceNumberGenerator.js';



const statusLabels = {
  draft: 'Borrador',
  generated: 'Generada',
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
        invoiceTypes,
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
        invoiceTypes,
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
      const estimates = await Estimate.findAll();


      const formattedInvoice = formatDatesForInput(
        this.formatItem(invoice),
        ['issue_date', 'due_date', 'updated_at', 'created_at']
      );

      res.render(`${this.viewPath}/edit`, {
        title: 'Editar Factura',
        item: formattedInvoice,
        invoiceTypes,
        clients,
        estimates,
        statusLabels,
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
      const estimates = await Estimate.findAll();


      const nextInvoiceNumber = await invoiceNumberGenerator();

      const estimateData = estimates.map(e => ({
        id: e._id,
        total: e.total_amount || 0
      }));

      res.render(`${this.viewPath}/new`, {
        title: `Nueva Factura`,
        item: {},
        invoice_number: nextInvoiceNumber,
        invoiceTypes,
        clients,
        estimates,
        statusLabels,
        currency_labels,
        estimateData
      });
    } catch (error) {
      console.error('Error al abrir formulario de Facturas:', error.message);
      res.status(500).render('error500', { title: 'Error de servidor' });
    }
  };


  createView = async (req, res) => {
    try {
      const {
        estimate_id,
        currency,
        extras_total,
        tax_percent,
        tax_amount,
        discount_percent,
        discount_amount,
        total_amount,
        validity_days,
        due_date,
        status,
        notes,
        items
      } = req.body;

      const itemsArray = items ? JSON.parse(items) : [];

      const extras_total_num = parseFloat(extras_total) || 0;
      const discount_amount_num = parseFloat(discount_amount) || 0;
      const tax_amount_num = parseFloat(tax_amount) || 0;
      const extras_final_total = extras_total_num - discount_amount_num + tax_amount_num;

      const newInvoice = {
        estimate_id,
        currency,
        extras_total: extras_total_num,
        tax_percent: parseFloat(tax_percent) || 0,
        tax_amount: tax_amount_num,
        discount_percent: parseFloat(discount_percent) || 0,
        discount_amount: discount_amount_num,
        extras_final_total,
        total_amount: parseFloat(total_amount) || 0,
        validity_days: parseInt(validity_days) || 0,
        due_date: due_date || null,
        status: status || 'draft',
        notes: notes || '',
        extras: itemsArray,
        issue_date: new Date(),
        invoice_number: 'pendiente', // hasta que se marque como enviada
        balance_due: parseFloat(total_amount) || 0,
        code: new mongoose.Types.ObjectId().toString()
      };

      const createdItem = await this.model.create(newInvoice);
      // 4️ Generar código definitivo
      if (this.codePrefix) {
        const estCode = this.codeGenerator.generateCodeFromId(createdItem._id, this.codePrefix);
        await Invoice.update(createdItem._id, { code: estCode });
        createdItem.code = estCode;
      }

      res.redirect(`/invoices/${createdItem._id}`);
    } catch (error) {
      console.error('Error al crear factura:', error.message);
      res.status(500).render('error500', { title: 'Error al crear factura' });
    }
  };


  updateView = async (req, res) => {
    try {
      const { id } = req.params;
      const invoice = await this.model.findById(id);

      if (!invoice) {
        return res.status(404).json({ message: 'Factura no encontrada' });
      }

      // Si la factura está en borrador (draft), se pueden modificar todos los campos
      if (invoice.status === 'draft') {
        const {
          estimate_id,
          currency,
          extras_total,
          tax_percent,
          tax_amount,
          discount_percent,
          discount_amount,
          total_amount,
          validity_days,
          due_date,
          status,
          description,
          items
        } = req.body;

        // Parsear el campo "items" (extras)
        const itemsArray = items ? JSON.parse(items) : [];

        const extras_total_num = parseFloat(extras_total) || 0;
        const discount_amount_num = parseFloat(discount_amount) || 0;
        const tax_amount_num = parseFloat(tax_amount) || 0;
        const extras_final_total = extras_total_num - discount_amount_num + tax_amount_num;

        const balanceDue = calculateBalanceDue(total_amount, this.paid_amount || 0);


        // Actualizar campos permitidos
        invoice.estimate_id = estimate_id || invoice.estimate_id;
        invoice.currency = currency || invoice.currency;
        invoice.extras_total = extras_total || 0;
        invoice.tax_percent = tax_percent || 0;
        invoice.tax_amount = tax_amount || 0;
        invoice.discount_percent = discount_percent || 0;
        invoice.discount_amount = discount_amount || 0;
        invoice.extras_final_total = extras_final_total || 0;
        invoice.total_amount = total_amount || 0;
        invoice.validity_days = validity_days || 0;
        invoice.due_date = due_date || null;
        invoice.status = status || invoice.status;
        invoice.description = description || invoice.description;
        invoice.extras = itemsArray;
        invoice.balance_due = balanceDue;

        // Mientras esté en borrador, mantener el número pendiente
        if (!invoice.invoice_number || invoice.invoice_number === '') {
          invoice.invoice_number = 'pendiente';
        }

      } else {
        // Si no está en borrador, solo se permite cambiar el estado
        if (req.body.status) {
          invoice.status = req.body.status;

          // Si el middleware detectó cambio a "sent" y no tiene número aún
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


  confirmGenerateInvoice = async (req, res) => {
    try {
      const { id } = req.params;
      const invoice = await Invoice.findById(id); // tu método de InvoiceModel

      if (!invoice) return res.status(404).send('Factura no encontrada');

      // Generar número solo si estaba pendiente
      if (!invoice.invoice_number || invoice.invoice_number === 'pendiente') {
        invoice.invoice_number = await invoiceNumberGenerator();
      }

      invoice.status = 'generated';

      await invoice.save(); // ⚡ Aquí usamos save() en lugar de findByIdAndUpdate

      res.redirect(`/invoices/${id}`);
    } catch (err) {
      console.error('Error en confirmGenerateInvoice:', err);
      res.status(500).send('Error al generar factura');
    }
  };

  previewInvoiceView = async (req, res) => {
    try {
      const { id } = req.params;
      const invoice = await this.model.findById(id);
      if (!invoice) return res.render('error404', { title: 'Factura no encontrada' });

      // const nextInvoiceNumber = await invoiceNumberGenerator();
      // console.log('Número de factura para previsualización:', nextInvoiceNumber);

      const nextInvoiceNumber = await getNextInvoiceNumberPreview();

      // --- Cálculos de totales ---
      const subtotalBudget = invoice.estimate_id?.subtotal || 0;
      const discountBudget = invoice.estimate_id?.discount_amount || 0;
      const taxBudget = invoice.estimate_id?.tax_amount || 0;

      const subtotalExtras = invoice.extras?.reduce((sum, ex) => sum + (ex.amount || 0), 0) || 0;
      const discountExtras = invoice.discount_amount || 0;
      const taxExtras = invoice.tax_amount || 0;

      // Totales combinados
      invoice.subtotal_total = subtotalBudget + subtotalExtras;
      invoice.discount_total = discountBudget + discountExtras;
      invoice.tax_total = taxBudget + taxExtras;
      invoice.total_final = invoice.subtotal_total - invoice.discount_total + invoice.tax_total;

      // --- Renderizar vista ---
      res.render(`${this.viewPath}/invoice-preview`, {
        title: `Generar Factura`,
        item: invoice,
        nextInvoiceNumber,
        invoiceTypes,
        statusLabels,
        currency_labels
      });

    } catch (err) {
      console.error('Error en previewInvoiceView:', err.message);
      res.status(500).render('error500', { title: 'Error al previsualizar factura' });
    }
  };


  generateInvoiceView = async (req, res) => {
    try {
      const { id } = req.params;
      console.log('ID de la factura a generar:', id);
      const invoice = await Invoice.findById(id);
      console.log('Factura obtenida:', invoice);

      if (!invoice) return res.status(404).send('Factura no encontrada');

      // Cambia estado y asigna número de factura
      invoice.status = 'generated';
      console.log(invoice.status);
      invoice.invoice_number = await invoiceNumberGenerator();
      console.log('Número de factura asignado:', invoice.invoice_number);
      await invoice.save();

      res.render('invoices/invoice-template', { item: invoice });
    } catch (err) {
      console.error('Error en generateInvoiceView:', err.message);
      res.status(500).send('Error generando factura');
    }
  };


  
}



export default new InvoiceController();
