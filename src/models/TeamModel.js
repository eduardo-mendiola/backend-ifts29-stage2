import mongoose from 'mongoose';
import BaseModel from './BaseModel.js';

const teamSchema = new mongoose.Schema({
    code: { type: String, unique: true },
    name: { type: String, required: true },
    description: { type: String },
    team_leader: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee', required: true },
    members: [
        {
            employee_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee', required: true },
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
        return this.model.find()
            .populate({
                path: 'team_leader',
                populate: {
                    path: 'user_id',
                    populate: { path: 'role_id' }
                }
            })
            .populate({
                path: 'members.employee_id',
                populate: {
                    path: 'user_id',
                    populate: { path: 'role_id' }
                }
            })
            .populate('members.team_role_id');
    }

    async findById(id) {
        return this.model.findById(id)
            .populate({
                path: 'team_leader',
                populate: {
                    path: 'user_id',
                    populate: { path: 'role_id' }
                }
            })
            .populate({
                path: 'members.employee_id',
                populate: {
                    path: 'user_id',
                    populate: { path: 'role_id' }
                }
            })
            .populate('members.team_role_id');
    }
}

export default new TeamModel();