import mongoose from 'mongoose';
import BaseModel from './BaseModel.js';

const invoiceSchema = new mongoose.Schema({
    code: { type: String, unique: true },
    estimate_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Estimate' },
    invoiece_number: { type: String, required: true },
    due_date: { type: Date },
    currency: { type: String, enum: ['USD', 'EUR', 'GBP', 'ARG'], default: 'USD' },
    items: [
        {
            description: { type: String, required: true },
            total_amount: { type: Number, required: true }
        }
    ],
    subtotal: { type: Number, required: true },
    taxes: { type: Number, required: true },
    discount: { type: Number },
    total_amount: { type: Number, required: true },
    paid_amount: { type: Number },
    balance_due: { type: Number },
    status: { type: String, enum: ['draft', 'sent', 'paid', 'overdue', 'cancelled'], default: 'draft' },
    notes: { type: String },
}, {
    collection: 'invoices',
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } // timestamps automáticos
});

class InvoiceModel extends BaseModel {
    constructor() {
        super(invoiceSchema, 'Invoice'); // Nombre del modelo único
    }

    async findAll() {
        return super.findAll([
            'assigned_to',
            'project_id',
            {
                path: 'time_entries_ids',
                populate: 'user_id'
            }
        ]); // populate automático
    }

    async findById(id) {
        return super.findById(id, [
            'assigned_to',
            'project_id',
            {
                path: 'time_entries_ids',
                populate: 'user_id'
            }
        ]); // populate automático
    }

}

export default new InvoiceModel();
