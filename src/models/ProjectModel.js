import mongoose from 'mongoose';
import BaseModel from './BaseModel.js';

const projectSchema = new mongoose.Schema({
    client_id: { type: mongoose.Schema.Types.ObjectId, ref: 'clients', required: true },
    name: { type: String, required: true },
    description: { type: String },
    start_date: { type: Date },
    end_date: { type: Date },
    budget: { type: Number },
    billing_type: { type: String, enum: ['hourly', 'fixed'], default: 'fixed' },
    status: { type: String, enum: ['pending', 'in_progress', 'completed'], default: 'pending' },
    manager_id: { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
}, {
    collection: 'projects',
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } // timestamps automáticos
});

class ProjectModel extends BaseModel {
    constructor() {
        super(projectSchema);
    }
}

export default new ProjectModel();
