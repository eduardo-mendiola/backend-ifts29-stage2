import mongoose from 'mongoose';
import BaseModel from './BaseModel.js';

const expenseCategorySchema = new mongoose.Schema({
    code: { type: String, unique: true },
    name: { type: String, required: true },
    description: { type: String }
}, { 
    collection: 'expense_categories',
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } 
});

class ExpenseCategoryModel extends BaseModel {
    constructor() {
        super(expenseCategorySchema, 'ExpenseCategory'); // Nombre del modelo único
    }

    // more area-specific methods can be added here
}

export default new ExpenseCategoryModel();


