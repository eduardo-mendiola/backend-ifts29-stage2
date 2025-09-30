import mongoose from 'mongoose';
import BaseModel from './BaseModel.js';

const teamSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String },
    team_leader: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, 
    members: [
        {
            user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
            role_in_team: { type: String, required: true }
        }
    ]
}, { 
    collection: 'teams',
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

class TeamModel extends BaseModel {
    constructor() {
        super(teamSchema, 'Team');
    }

    // Obtener todos los equipos con líderes y miembros poblados
    async findAll() {
        return super.findAll(['team_leader', 'members.user_id']);
    }

    async findById(id) {
        return super.findById(id, ['team_leader', 'members.user_id']);
    }
}

export default new TeamModel();
