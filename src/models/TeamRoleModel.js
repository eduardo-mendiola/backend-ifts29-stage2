import mongoose from 'mongoose';
import BaseModel from './BaseModel.js';

const teamRoleSchema = new mongoose.Schema({
    code: { type: String, unique: true },
    name: { type: String, required: true, unique: true },
    description: { type: String }
}, {
    collection: 'team_roles',
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

// Registrar el modelo en mongoose ANTES de crear la clase
const TeamRoleMongooseModel = mongoose.model('TeamRole', teamRoleSchema);

class TeamRoleModel extends BaseModel {
    constructor() {
        super(teamRoleSchema, 'TeamRole');
    }

    // Obtener todos los roles de equipo
    async findAll() {
        return super.findAll();
    }
   
    async findByName(name, excludeId = null) {
        const query = { name };
        if (excludeId) query._id = { $ne: excludeId }; // excluye el mismo id
        return this.model.findOne(query);
    }

}

export default new TeamRoleModel();