import mongoose from 'mongoose';
import BaseModel from './BaseModel.js';

const projectSchema = new mongoose.Schema({
    code: { type: String, unique: true },
    client_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Client', required: true },
    name: { type: String, required: true },
    description: { type: String },
    start_date: { type: Date },
    end_date: { type: Date },
    budget: { type: Number },
    billing_type: { type: String, enum: ['hourly', 'fixed'], default: 'fixed' },
    status: { type: String, enum: ['pending', 'in_progress', 'completed'], default: 'pending' },
    project_manager: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    teams: [
        {
            team_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Team' },
        }
    ]
}, {
    collection: 'projects',
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

class ProjectModel extends BaseModel {
    constructor() {
        super(projectSchema, 'Project');
    }

    async findAll() {
        return super.findAll([
            { path: 'client_id' },
            { path: 'project_manager', model: 'User', select: 'first_name last_name' }, 
            {
                path: 'teams.team_id',
                select: 'name team_leader', // traigo el nombre del equipo y el líder
                populate: { path: 'team_leader', model: 'User', select: 'first_name last_name' } // anidado
            }
        ]);
    }

    async findById(id) {
        return super.findById(id, [
            { path: 'client_id' },
            { path: 'project_manager', model: 'User', select: 'first_name last_name' },
            {
                path: 'teams.team_id',
                select: 'name team_leader',
                populate: { path: 'team_leader', model: 'User', select: 'first_name last_name' }
            }
        ]);
    }
}

export default new ProjectModel();
