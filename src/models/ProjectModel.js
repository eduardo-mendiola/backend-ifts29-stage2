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
    team_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Team' },
}, {
    collection: 'projects' // timestamps automáticos
});

class ProjectModel extends BaseModel {
    constructor() {
        super(projectSchema, 'Project'); // Nombre del modelo único
    }

    async findAll() {
        return super.findAll([
            { path: 'client_id' },
            {
                path: 'team_id',
                populate: { path: 'team_leader', model: 'User' } // Populate anidado para team_leader
            }
        ]); // populate automático
    }

    async findById(id) {
        return super.findById(id, [
            { path: 'client_id' },
            {
                path: 'team_id',
                populate: { path: 'team_leader', model: 'User' } // Populate anidado para team_leader
            }
        ]); // populate automático
    }

}

export default new ProjectModel();
