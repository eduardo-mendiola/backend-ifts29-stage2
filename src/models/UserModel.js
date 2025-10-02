import mongoose from 'mongoose';
import BaseModel from './BaseModel.js';

const userSchema = new mongoose.Schema({
    code: { type: String, unique: true },
    first_name: { type: String, required: true },
    last_name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password_hash: { type: String, required: true },
    phone: { type: String },
    role_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Role', required: true },
    area_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Area', required: true },
    monthly_salary: { type: Number },
    is_active: { type: Boolean, default: true },
}, { 
    collection: 'users',
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

class UserModel extends BaseModel {
    constructor() {
        super(userSchema, 'User'); // Nombre del modelo único
    }

    async findAll() {
        return super.findAll(['role_id', 'area_id']); // populate automático
    }

    async findById(id) {
        return super.findById(id, ['role_id', 'area_id']); // populate automático
    }
}

export default new UserModel();
