import mongoose from 'mongoose';
import BaseModel from './BaseModel.js';

const teamSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String },
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

    // Ejemplo: obtener todos los equipos con los datos de los usuarios poblados
    async findAll() {
        return super.findAll(['members.user_id']);
    }

    async findById(id) {
        return super.findById(id, ['members.user_id']);
    }
}

export default new TeamModel();
