import mongoose from 'mongoose';
import BaseModel from './BaseModel.js';

const invoiceSchema = new mongoose.Schema({
    code: { type: String, unique: true },
    estimate_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Estimate' },
    invoice_type: { type: String, enum: ['A', 'B', 'C', 'E'] },
    invoice_number: { type: String, required: true },
    validity_days: { type: Number, default: 15 },
    due_date: { type: Date },
    issue_date: { type: Date},
    // INICIO Para los extras de la factura
    currency: { type: String, enum: ['USD', 'EUR', 'GBP', 'ARG'], default: 'USD' },
    extras: [
        {
            description: { type: String, required: true },
            amount: { type: Number, required: true }
        }
    ],
    extras_total: { type: Number, default: 0 },
    discount_percent: { type: Number, default: 0 },
    discount_amount: { type: Number, default: 0 },
    tax_percent: { type: Number, default: 0 },
    tax_amount: { type: Number, default: 0 },
    extras_final_total: { type: Number, default: 0 },
    // FIN Para los extras de la factura
    
    total_amount: { type: Number, required: true },
    paid_amount: { type: Number, default: 0 },
    balance_due: { type: Number },
    status: { type: String, enum: ['draft', 'generated', 'paid', 'overdue', 'cancelled'], default: 'draft' },
    notes: { type: String },
}, {
    collection: 'invoices',
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }, // timestamps automáticos
    toObject: { virtuals: true },
    toJSON: { virtuals: true }
});

// Virtuals para campos derivados
invoiceSchema.virtual('project_name').get(function () {
    return this.estimate_id?.project_id?.name || null;
});

invoiceSchema.virtual('project_code').get(function () {
    return this.estimate_id?.project_id?.code || null;
});

invoiceSchema.virtual('client_full_name').get(function () {
    return this.estimate_id?.project_id?.client_id?.name || null;
});

invoiceSchema.virtual('client_code').get(function () {
    return this.estimate_id?.project_id?.client_id?.code || null;
});

invoiceSchema.virtual('subtotal').get(function () {
    return this.estimate_id?.total_amount || null;
});

class InvoiceModel extends BaseModel {
    constructor() {
        super(invoiceSchema, 'Invoice'); // Nombre del modelo único
    }

    async findAll() {
        return super.findAll([
            {
                path: 'estimate_id',
                populate: {
                    path: 'project_id',
                    populate: {
                        path: 'client_id'
                    }
                }
            }
        ]); // populate automático
    }

    async findById(id) {
        return super.findById(id, [
            {
                path: 'estimate_id',
                populate: {
                    path: 'project_id',
                    populate: {
                        path: 'client_id'
                    }
                }
            }
        ]); // populate automático
    }

}

export default new InvoiceModel();
