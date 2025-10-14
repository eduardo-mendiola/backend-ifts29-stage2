import mongoose from 'mongoose';
import BaseModel from './BaseModel.js';

const userSchema = new mongoose.Schema({
  code: { type: String, unique: true },
  first_name: { type: String, required: true },
  last_name: { type: String, required: true },
  dni: { type: String, required: true, unique: true },
  username: { type: String, required: true, unique: true },
  password_hash: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String },
  role_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Role', required: true },
  area_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Area', required: true },
  nationality: { type: String },
  birth_date: { type: Date },
  address: {
    street: { type: String },
    number: { type: String },
    city: { type: String },
    province: { type: String },
    country: { type: String },
    postal_code: { type: String },
  },
  gender: { type: String, enum: ['male', 'female', 'other'] },
  hire_date: { type: Date },
  position_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Position' },
  employment_type: { type: String, enum: ['full-time', 'part-time', 'contractor'] },
  supervisor_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  profile_image: { type: String },
  last_login: { type: Date },
  monthly_salary: { type: Number },
  is_active: { type: Boolean, default: true },
}, {
  collection: 'users',
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

// Virtuals
userSchema.virtual('full_name').get(function () {
  return `${this.first_name} ${this.last_name}`;
});

// Para incluir virtuals automáticamente al convertir a JSON u objeto
userSchema.set('toObject', { virtuals: true });
userSchema.set('toJSON', { virtuals: true });

class UserModel extends BaseModel {
  constructor() {
    super(userSchema, 'User');
  }

  async findAll() {
    return super.findAll(['role_id', 'area_id', 'supervisor_id', 'position_id']); // populate automático
  }

  async findById(id) {
    return super.findById(id, ['role_id', 'area_id', 'supervisor_id', 'position_id']); // populate automático
  }
}

export default new UserModel();
