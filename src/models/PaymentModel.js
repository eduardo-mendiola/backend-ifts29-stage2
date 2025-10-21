import mongoose from 'mongoose';
import BaseModel from './BaseModel.js';

const paymentSchema = new mongoose.Schema({
    code: { type: String, unique: true },
    invoice_number: { type: String, unique: true },
    transaction_id: { type: String, unique: true },
    payment_date: { type: Date, required: true },
    payment_method: { type: String, enum: ['bank_transfer', 'credit_card', 'cash', 'check', 'paypal'], default: 'bank_transfer' },
    currency: { type: String, enum: ['USD', 'EUR', 'GBP', 'ARG'], default: 'USD' },
    amount: { type: Number, required: true },
    description: { type: String },
    status: { type: String, enum: ['success', 'cancelled'], default: 'success' },
}, {
    collection: 'payments',
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } // timestamps automáticos
});

class PaymentModel extends BaseModel {
    constructor() {
        super(paymentSchema, 'Payment'); // Nombre del modelo único
    }
    
}

export default new PaymentModel();
