import mongoose from 'mongoose';
import BaseModel from './BaseModel.js';

const employeeSchema = new mongoose.Schema({
  code: { type: String, unique: true },
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  first_name: { type: String, required: true },
  last_name: { type: String, required: true },
  dni: { type: String, required: true, unique: true },
  phone: { type: String },
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
  supervisor_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee' },
  profile_image: { type: String },
  monthly_salary: { type: Number },
  is_active: { type: Boolean, default: true },
}, {
  collection: 'employees',
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

// Virtuals
employeeSchema.virtual('full_name').get(function () {
  return `${this.first_name} ${this.last_name}`;
});

// Para incluir virtuals automáticamente al convertir a JSON u objeto
employeeSchema.set('toObject', { virtuals: true });
employeeSchema.set('toJSON', { virtuals: true });

class EmployeeModel extends BaseModel {
  constructor() {
    super(employeeSchema, 'Employee');
  }

  async findAll() {
    return super.findAll([
      'area_id',
      'position_id',
      'supervisor_id',
      {
        path: 'user_id',
        populate: 'role_id'
      }
    ]); // populate automático
  }

  async findById(id) {
    return super.findById(id, [
      'area_id',
      'position_id',
      'supervisor_id',
      {
        path: 'user_id',
        populate: 'role_id'
      }
    ]); // populate automático
  }
}

export default new EmployeeModel();
