import mongoose from 'mongoose';
import BaseModel from './BaseModel.js';

const receiptSchema = new mongoose.Schema({
    code: { type: String, unique: true },
    invoice_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Invoice', required: true },
    currency: { type: String, enum: ['USD', 'EUR', 'GBP', 'ARG'], default: 'USD' },
    amount: { type: Number, required: true },
    payment_date: { type: Date },
    payment_method: { type: String, enum: ['bank_transfer', 'credit_card', 'cash', 'check', 'paypal'], default: 'bank_transfer' },
    transaction_id: { type: String, unique: true },
}, {
    collection: 'receipts',
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }, // timestamps automáticos
    toObject: { virtuals: true },
    toJSON: { virtuals: true }
});

// Virtuals para campos derivados
receiptSchema.virtual('project_name').get(function () {
    return this.invoice_id?.estimate_id?.project_id?.name || null;
});

receiptSchema.virtual('project_code').get(function () {
    return this.invoice_id?.estimate_id?.project_id?.code || null;
});

receiptSchema.virtual('client_full_name').get(function () {
    return this.invoice_id?.estimate_id?.project_id?.client_id?.name || null;
});

receiptSchema.virtual('client_code').get(function () {
    return this.invoice_id?.estimate_id?.project_id?.client_id?.code || null;
});

receiptSchema.virtual('amount_total').get(function () {
    return this.invoice_id?.total_amount || null;
});

receiptSchema.virtual('invoice_number').get(function () {
    return this.invoice_id?.invoice_number || null;
});


class ReceiptModel extends BaseModel {
    constructor() {
        super(receiptSchema, 'receipt'); // Nombre del modelo único
    }

    async findAll() {
        return super.findAll([
            {
                path: 'invoice_id',
                populate: {
                    path: 'estimate_id',
                    populate: {
                        path: 'project_id',
                        populate: {
                            path: 'client_id'
                        }
                    }
                }
            }
        ]); // populate automático
    }

    async findById(id) {
        return super.findById(id, [
            {
                path: 'invoice_id',
                populate: {
                    path: 'estimate_id',
                    populate: {
                        path: 'project_id',
                        populate: {
                            path: 'client_id'
                        }
                    }
                }
            }
        ]); // populate automático
    }

}

export default new ReceiptModel();
