import mongoose from 'mongoose';
import BaseModel from './BaseModel.js';

const userSchema = new mongoose.Schema({
  code: { type: String, unique: true },
  username: { type: String, required: true, unique: true },
  password_hash: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  role_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Role', required: true },
  last_login: { type: Date },
  is_active: { type: Boolean, default: true },
}, {
  collection: 'users',
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});


class UserModel extends BaseModel {
  constructor() {
    super(userSchema, 'User');
  }

  async findAll() {
    return super.findAll(['role_id']); // populate automático
  }

  async findById(id) {
    return super.findById(id, ['role_id']); // populate automático
  }
}

export default new UserModel();
