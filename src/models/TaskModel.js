import mongoose from 'mongoose';
import BaseModel from './BaseModel.js';

const taskSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String },
    priority: { type: String, enum: ['baja', 'media', 'alta'], default: 'media' },
    status: { type: String, enum: ['pending', 'in_progress', 'completed'], default: 'pending' },
    assigned_to: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    estimated_hours: { type: Number },
    due_date: { type: Date },
    project_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Project' },
}, {
    collection: 'tasks',
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } // timestamps automáticos
});

class TaskModel extends BaseModel {
    constructor() {
        super(taskSchema, 'Task'); // Nombre del modelo único
    }

    async findAll() {
        return super.findAll(['assigned_to', 'project_id']); // populate automático
    }   

    async findById(id) {
        return super.findById(id, ['assigned_to', 'project_id']); // populate automático
    }
    
}

export default new TaskModel();
