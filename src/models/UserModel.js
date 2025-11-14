import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import BaseModel from './BaseModel.js';

const userSchema = new mongoose.Schema({
  code: { type: String, unique: true },
  username: { type: String, required: true, unique: true, trim: true, minlength: 3 },
  password_hash: { type: String, required: true },
  email: { 
    type: String, 
    required: true, 
    unique: true, 
    trim: true, 
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, 'Email inválido']
  },
  role_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Role', required: true },
  last_login: { type: Date },
  is_active: { type: Boolean, default: true },
}, {
  collection: 'users',
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

// Método para hashear contraseña antes de guardar
userSchema.pre('save', async function(next) {
  // Solo hashear si la contraseña fue modificada (o es nueva)
  if (!this.isModified('password_hash')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password_hash = await bcrypt.hash(this.password_hash, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Método para comparar contraseñas
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password_hash);
};

// No devolver el hash en JSON
userSchema.methods.toJSON = function() {
  const obj = this.toObject();
  delete obj.password_hash;
  delete obj.__v;
  return obj;
};

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

  // Método para buscar por username
  async findByUsername(username) {
    return this.model.findOne({ username }).populate('role_id');
  }

  // Método para actualizar último login
  async updateLastLogin(userId) {
    return this.model.findByIdAndUpdate(
      userId, 
      { last_login: new Date() },
      { new: true }
    );
  }
}

export default new UserModel();
