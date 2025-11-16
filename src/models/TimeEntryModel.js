import mongoose from 'mongoose';
import BaseModel from './BaseModel.js';

const timeEntrySchema = new mongoose.Schema({
    code: { type: String, unique: true },
    employee_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee', required: true },
    task_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Task', required: true },
    description: { type: String },
    date: { type: Date },
    hours_worked: { type: Number },
    description: { type: String, required: true },
    billable: { type: Boolean, default: true },
    approved: { type: Boolean, default: false },
    approved_by: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee' },
    supervisor_comment: { type: String }
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
            'employee_id',
            'approved_by',
            { path: 'task_id', populate: { path: 'project_id' } }
        ]); // populate automático
    }

    async findById(id) {
        return super.findById(id, [
            'employee_id',
            'approved_by',
            { path: 'task_id', populate: { path: 'project_id' } }
        ]); // populate automático
    }

    async findByUserProjects(userId) {
        // 1. Encontrar el empleado asociado al usuario
        const Employee = mongoose.model('Employee');
        const employee = await Employee.findOne({ user_id: userId });
        
        if (!employee) {
            return [];
        }

        // Solo obtener time entries del empleado
        const query = { employee_id: employee._id };
        
        const timeEntries = await this.model.find(query)
            .populate('employee_id')
            .populate('approved_by')
            .populate({
                path: 'task_id',
                populate: { path: 'project_id' }
            });
        
        return timeEntries;
    }

}

export default new TimeEntryModel();
