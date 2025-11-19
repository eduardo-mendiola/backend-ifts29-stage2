import mongoose from 'mongoose';
import BaseModel from './BaseModel.js';

const taskSchema = new mongoose.Schema({
    code: { type: String, unique: true },
    title: { type: String, required: true },
    description: { type: String },
    priority: { type: String, enum: ['baja', 'media', 'alta'], default: 'media' },
    status: { type: String, enum: ['pending', 'in_progress', 'completed'], default: 'pending' },
    assigned_to: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee', required: true },
    assigned_by: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    estimated_hours: { type: Number },
    due_date: { type: Date },
    project_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Project' },
    time_entries_ids: [{ type: mongoose.Schema.Types.ObjectId, ref: 'TimeEntry' }],
}, {
    collection: 'tasks',
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } // timestamps automáticos
});

class TaskModel extends BaseModel {
    constructor() {
        super(taskSchema, 'Task'); // Nombre del modelo único
    }

    async findAll() {
        return super.findAll([
            'assigned_to',
            { 
                path: 'assigned_by', 
                select: 'username email',
                populate: {
                    path: 'employee',
                    select: 'first_name last_name'
                }
            },
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
            { 
                path: 'assigned_by', 
                select: 'username email',
                populate: {
                    path: 'employee',
                    select: 'first_name last_name'
                }
            },
            'project_id', 
            {
                path: 'time_entries_ids', 
                populate: 'employee_id'
            }
        ]); // populate automático
    }

    async findByUserProjects(userId) {
        console.log('findByUserProjects - userId:', userId);
        
        // 1. Encontrar el empleado asociado al usuario
        const Employee = mongoose.model('Employee');
        const employee = await Employee.findOne({ user_id: userId });
        
        console.log('Empleado encontrado:', employee ? employee._id : 'null');
        
        if (!employee) {
            return [];
        }

        // Solo obtener tareas asignadas directamente al empleado
        const query = { assigned_to: employee._id };
        console.log('Query para tareas:', JSON.stringify(query, null, 2));
        
        const tasks = await this.model.find(query)
        .populate('assigned_to')
        .populate({ 
            path: 'assigned_by', 
            select: 'username email',
            populate: {
                path: 'employee',
                select: 'first_name last_name'
            }
        })
        .populate('project_id')
        .populate({
            path: 'time_entries_ids',
            populate: 'employee_id'
        });
        
        console.log('Tareas encontradas:', tasks.length);
        return tasks;
    }
    
}

export default new TaskModel();
