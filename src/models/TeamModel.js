import mongoose from 'mongoose';
import BaseModel from './BaseModel.js';

const teamSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String },
    team_leader: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, 
    members: [
        {
            user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
            team_role_id: { type: mongoose.Schema.Types.ObjectId, ref: 'TeamRole', required: true }
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

    // Obtener todos los equipos con líderes, miembros y roles de equipo poblados
    async findAll() {
        return super.findAll(['team_leader', 'members.user_id', 'members.team_role_id']);
    }

    async findById(id) {
        return super.findById(id, ['team_leader', 'members.user_id', 'members.team_role_id']);
    }
}

export default new TeamModel();