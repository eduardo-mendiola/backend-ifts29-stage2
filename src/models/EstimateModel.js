import mongoose from 'mongoose';
import BaseModel from './BaseModel.js';

const estimateSchema = new mongoose.Schema({
    code: { type: String, unique: true },
    client_to: { type: mongoose.Schema.Types.ObjectId, ref: 'Client', required: true },
    project_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Project' },
    title: { type: String, required: true },
    description: { type: String },
    total_amount: { type: Number },
    status: { type: String, enum: ['enviado', 'aceptado', 'borrador'], default: 'borrador' },
    valid_until: { type: Date },
}, {
    collection: 'estimates',
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } // timestamps automáticos
});

class EstimateModel extends BaseModel {
    constructor() {
        super(estimateSchema, 'Estimate'); // Nombre del modelo único
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

export default new EstimateModel();
