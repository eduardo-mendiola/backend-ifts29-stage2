import mongoose from 'mongoose';
import BaseModel from './BaseModel.js';

const expenseSchema = new mongoose.Schema({
    code: { type: String, unique: true },
    project_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Project' },
    employee_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee', required: true },
    description: { type: String },
    amount: { type: Number, required: true },
    currency: { type: String, enum: ['USD', 'EUR', 'GBP', 'ARG'], default: 'USD' },
    date: { type: Date },
    category_id: { type: mongoose.Schema.Types.ObjectId, ref: 'ExpenseCategory', required: true },
    payment_method: { type: String, enum: ['bank_transfer', 'credit_card', 'cash', 'check', 'paypal'], default: 'credit_card' },
    status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
    notes: { type: String },
}, {
    collection: 'expenses',
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } // timestamps automáticos
});

class ExpenseModel extends BaseModel {
    constructor() {
        super(expenseSchema, 'Expense'); // Nombre del modelo único
    }

    async findAll() {
        return super.findAll([
            'project_id', 
            'employee_id', 
            'category_id'
        ]); // populate automático
    }   

    async findById(id) {
        return super.findById(id, [
            'project_id', 
            'employee_id', 
            'category_id'
        ]); // populate automático
    }
    
}

export default new ExpenseModel();