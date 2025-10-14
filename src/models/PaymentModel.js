import mongoose from 'mongoose';
import BaseModel from './BaseModel.js';

const paymentSchema = new mongoose.Schema({
    code: { type: String, unique: true },
    title: { type: String, required: true },
    description: { type: String },
    priority: { type: String, enum: ['baja', 'media', 'alta'], default: 'media' },
    status: { type: String, enum: ['pending', 'in_progress', 'completed'], default: 'pending' },
    assigned_to: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee', required: true },
    estimated_hours: { type: Number },
    due_date: { type: Date },
    project_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Project' },
    time_entries_ids: [{ type: mongoose.Schema.Types.ObjectId, ref: 'TimeEntry' }],
}, {
    collection: 'payments',
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } // timestamps automáticos
});

class PaymentModel extends BaseModel {
    constructor() {
        super(paymentSchema, 'Payment'); // Nombre del modelo único
    }

    async findAll() {
        return super.findAll([
            'assigned_to', 
            'project_id', 
            {
                path: 'time_entries_ids', 
                populate: 'employee_id'
            }
        ]); // populate automático
    }   

    async findById(id) {
        return super.findById(id, [
            'assigned_to', 
            'project_id', 
            {
                path: 'time_entries_ids', 
                populate: 'employee_id'
            }
        ]); // populate automático
    }
    
}

export default new PaymentModel();
