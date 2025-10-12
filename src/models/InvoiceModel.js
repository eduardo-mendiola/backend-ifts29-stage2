import mongoose from 'mongoose';
import BaseModel from './BaseModel.js';

const invoiceSchema = new mongoose.Schema({
    code: { type: String, unique: true },
    estimate_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Estimate' },
    invoice_number: { type: String, required: true },
    due_date: { type: Date },
    currency: { type: String, enum: ['USD', 'EUR', 'GBP', 'ARG'], default: 'USD' },
    items: [
        {
            description: { type: String, required: true },
            total_amount: { type: Number, required: true }
        }
    ],
    subtotal: { type: Number, required: true },
    tax_percent: { type: Number, required: true },
    taxes: { type: Number, required: true },
    discount_percent: { type: Number },
    discount: { type: Number },
    subtotal: { type: Number, required: true },
    total_amount: { type: Number, required: true },
    paid_amount: { type: Number },
    balance_due: { type: Number },
    status: { type: String, enum: ['draft', 'sent', 'paid', 'overdue', 'cancelled'], default: 'draft' },
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

invoiceSchema.virtual('client_full_name').get(function () {
  return this.estimate_id?.project_id?.client_id?.name || null;
});

invoiceSchema.virtual('client_code').get(function () {
  return this.estimate_id?.project_id?.client_id?.code || null;
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
