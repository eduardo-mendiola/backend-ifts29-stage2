import mongoose from 'mongoose';
import BaseModel from './BaseModel.js';

const timeEntrySchema = new mongoose.Schema({
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    task_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Task', required: true },
    description: { type: String },
    date: { type: Date },
    hours_worked: { type: Number },
    description: { type: String, required: true },
    billable: { type: Boolean, default: true }
}, {
    collection: 'time_entries',
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } // timestamps automáticos
});

class TimeEntryModel extends BaseModel {
    constructor() {
        super(timeEntrySchema, 'TimeEntry'); // Nombre del modelo único
    }

    async findAll() {
        return super.findAll([
            'user_id',
            { path: 'task_id', populate: { path: 'project_id' } }
        ]); // populate automático
    }   

    async findById(id) {
        return super.findById(id, [
            'user_id',
            { path: 'task_id', populate: { path: 'project_id' } }
        ]); // populate automático
    }
    
}

export default new TimeEntryModel();
