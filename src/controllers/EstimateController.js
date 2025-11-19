import PermissionAwareController from './PermissionAwareController.js';
import Estimate from '../models/EstimateModel.js';
import Project from '../models/ProjectModel.js';
import Client from '../models/ClientModel.js';
import { formatDatesForInput } from '../utils/dateHelpers.js';
import mongoose from 'mongoose';
import { calculateInvoiceTotals, calculateBalanceDue } from '../utils/invoiceHelpers.js';

const statusLabels = {
    draft: 'Borrador',
    sent: 'Enviado',
    viewed: 'Visto',
    accepted: 'Aceptado',
    rejected: 'Rechazado',
    expired: 'Vencido',
    converted: 'Convertido'
};

const currency_labels = {
    USD: 'Dólar estadounidense',
    EUR: 'Euro',
    GBP: 'Libra esterlina',
    ARG: 'Peso argentino'
};

class EstimateController extends PermissionAwareController {
    constructor() {
        super(Estimate, 'estimates', 'estimates', 'EST-');
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

    // View for displaying an estimate by ID (for show.pug)
    getByIdView = async (req, res) => {
        try {
            const { id } = req.params;
            const estimate = await this.model.findById(id);
            if (!estimate) return res.render('error404', { title: 'Presupuesto no encontrado' });

            // Format dates before sending to the view
            const formattedEstimate = formatDatesForInput(
                this.formatItem(estimate),
                ['valid_until', 'updated_at', 'created_at']
            );

            res.render(`${this.viewPath}/show`, {
                title: `Ver Presupuesto`,
                item: formattedEstimate,
                statusLabels,
                currency_labels
            });

        } catch (error) {
            console.error('Error en getByIdView:', error.message);
            res.status(500).render('error500', { title: 'Error del servidor' });
        }
    };


    updateView = async (req, res) => {
        try {
            const { id } = req.params;
            const {
                title,
                project_id,
                currency,
                subtotal,
                tax_percent,
                tax_amount,
                discount_percent,
                discount_amount,
                total_amount,
                validity_days,
                valid_until,
                status,
                description,
                client_id,
                items
            } = req.body;

            // Parsear el campo "items" que llega como JSON
            const itemsArray = items ? JSON.parse(items) : [];

            // 👇 usar el modelo Mongoose interno
            await this.model.model.findByIdAndUpdate(
                id,
                {
                    title,
                    project_id,
                    client_id,
                    currency,
                    subtotal,
                    tax_percent,
                    tax_amount,
                    discount_percent,
                    discount_amount,
                    total_amount,
                    validity_days,
                    valid_until,
                    status,
                    description,
                    estimates_items: itemsArray
                },
                { new: true }
            );

            res.redirect(`/estimates/${id}`);
        } catch (error) {
            console.error('Error en update:', error.message);
            res.status(500).render('error500', { title: 'Error del servidor' });
        }
    };


    // View for editing an estimate
    getEditView = async (req, res) => {
        try {
            const { id } = req.params;
            const estimate = await this.model.findById(id);
            if (!estimate) return res.render('error404', { title: 'Presupuesto no encontrado' });

            const clients = await Client.findAll();
            const projects = await Project.findAll();

            // Format dates before sending to the view
            const formattedEstimate = formatDatesForInput(
                this.formatItem(estimate),
                ['valid_until', 'updated_at', 'created_at']
            );

            res.render(`${this.viewPath}/edit`, {
                title: `Editar Presupuesto`,
                item: formattedEstimate,
                clients,
                projects,
                statusLabels,
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
                title: `Nuevo Presupuesto`,
                item: {},
                clients,
                projects,
                statusLabels,
                currency_labels
            });
        } catch (error) {
            console.error('Error al abrir formulario de presupuestos:', error.message);
            res.status(500).render('error500', { title: 'Error de servidor' });
        }
    };


    createView = async (req, res) => {
        try {
            const {
                title,
                project_id,
                client_id,
                currency,
                subtotal,
                tax_percent,
                tax_amount,
                discount_percent,
                discount_amount,
                total_amount,
                valid_until,
                status,
                description,
                items
            } = req.body;

            const itemsArray = items ? JSON.parse(items) : [];

            const newEstimate = {
                title,
                project_id,
                client_id,
                currency,
                subtotal,
                tax_percent,
                tax_amount,
                discount_percent,
                discount_amount,
                total_amount,
                valid_until,
                status,
                description,
                estimates_items: itemsArray,
                code: new mongoose.Types.ObjectId().toString()
            };

            const createdItem = await this.model.create(newEstimate);
            // 4️ Generar código definitivo 
            if (this.codePrefix) {
                const estCode = this.codeGenerator.generateCodeFromId(createdItem._id, this.codePrefix);
                await Estimate.update(createdItem._id, { code: estCode });
                createdItem.code = estCode;
            }

            res.redirect(`/estimates/${createdItem.id}`);
        } catch (error) {
            console.error('Error al crear presupuesto:', error.message);
            res.status(500).render('error500', { title: 'Error del servidor' });
        }
    };

}

export default new EstimateController();
