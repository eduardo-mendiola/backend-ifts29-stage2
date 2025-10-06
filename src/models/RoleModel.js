import mongoose from 'mongoose';
import BaseModel from './BaseModel.js';

const roleSchema = new mongoose.Schema({
    code: { type: String, unique: true },
    name: { type: String, required: true },
    description: { type: String },
    permissions: { type: [String], default: [] } // nuevo campo permissions
}, { 
    collection: 'roles' 
});

class RoleModel extends BaseModel {
    constructor() { 
        super(roleSchema, 'Role');
    }

    // Método para buscar todos los roles con sus permisos
    async findAllWithPermissions() {
        return super.findAll(); // ya devuelve el array completo con permissions
    }

    // Método para buscar un rol por código
    async findByCode(code) {
        return this.model.findOne({ code });
    }
}

export default new RoleModel();
