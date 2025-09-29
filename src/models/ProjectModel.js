import mongoose from 'mongoose';
import BaseModel from './BaseModel.js';

const projectSchema = new mongoose.Schema({
    client_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Client', required: true },
    name: { type: String, required: true },
    description: { type: String },
    start_date: { type: Date },
    end_date: { type: Date },
    budget: { type: Number },
    billing_type: { type: String, enum: ['hourly', 'fixed'], default: 'fixed' },
    status: { type: String, enum: ['pending', 'in_progress', 'completed'], default: 'pending' },
    manager_user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, {
    collection: 'projects' // timestamps automáticos
});

class ProjectModel extends BaseModel {
    constructor() {
        super(projectSchema, 'Project'); // Nombre del modelo único
    }

    async findAll() {
        return super.findAll(['client_id', 'manager_user_id']); // populate automático
    }   

    async findById(id) {
        return super.findById(id, ['client_id', 'manager_user_id']); // populate automático
    }
    
}

export default new ProjectModel();
