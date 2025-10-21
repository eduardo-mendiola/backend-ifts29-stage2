import BaseController from './BaseController.js'
import Payment from '../models/PaymentModel.js';
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

class PaymentController extends BaseController {
    constructor() {
        super(Payment, 'payments', 'PAY-');
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

    // View for displaying an payment by ID (for show.pug)
    getByIdView = async (req, res) => {
        try {
            const { id } = req.params;
            const payment = await this.model.findById(id);
            if (!payment) return res.render('error404', { title: 'Pago no encontrado' });

            // Format dates before sending to the view
            const formattedPayment = formatDatesForInput(
                this.formatItem(payment),
                ['payment_date', 'updated_at', 'created_at']
            );

            res.render(`${this.viewPath}/show`, {
                title: `Ver Pago`,
                item: formattedPayment,
                payment_method_labels,
                currency_labels,
                status_labels
            });

        } catch (error) {
            console.error('Error en getByIdView:', error.message);
            res.status(500).render('error500', { title: 'Error del servidor' });
        }
    };


    newView = async (req, res) => {
        try {

            res.render(`${this.viewPath}/new`, {
                title: `Nuevo Pago`,
                item: {}, // objeto vacío porque es nuevo
                payment_method_labels,
                currency_labels,
                status_labels,

            });
        } catch (error) {
            console.error('Error al abrir formulario de pagos:', error.message);
            res.status(500).render('error500', { title: 'Error de servidor' });
        }
    };

    updateStatus = async (req, res) => {
        try {
            const { id } = req.params;
            const { status } = req.body;

            const payment = await this.model.findById(id);
            if (!payment) {
                return res.status(404).json({ message: 'Pago no encontrado' });
            }

            // Validación de negocio - solo verificar si ya está cancelado
            if (payment.status === 'cancelled') {
                return res.status(400).json({ message: 'El Pago ya está anulado.' });
            }

            // Cambiar el status del Pago a cancelled
            payment.status = 'cancelled';
            await payment.save();

            return res.redirect('/payments/');

        } catch (error) {
            console.error('Error cambiando estado del Pago:', error.message);
            console.error('Stack:', error.stack); // Más detalles del error
            return res.status(500).render('error500', { title: 'Error al cambiar estado' });
        }
    };
}

export default new PaymentController();