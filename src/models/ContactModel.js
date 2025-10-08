import mongoose from 'mongoose';
import BaseModel from './BaseModel.js';

const contactSchema = new mongoose.Schema({
  code: { type: String, unique: true },
  client_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Client', required: true },
  first_name: { type: String, required: true },
  last_name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String },
  mobile: { type: String, required: true },
  role: { type: String, required: true },
  department: { type: String, required: true },
  is_primary: { type: Boolean, default: true },
  is_active: { type: Boolean, default: true },
  preffer_contact_method: { type: String, enum: ['email', 'phone', 'none'], default: 'email' },
  language: { type: String },
  notes: { type: String },
}, {
  collection: 'contacts',
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

// Virtuals
contactSchema.virtual('full_name').get(function () {
  return `${this.first_name} ${this.last_name}`;
});

// Para incluir virtuals automáticamente al convertir a JSON u objeto
contactSchema.set('toObject', { virtuals: true });
contactSchema.set('toJSON', { virtuals: true });

class ContactModel extends BaseModel {
  constructor() {
    super(contactSchema, 'Contact');
  }

  async findAll() {
    return super.findAll(['client_id']); // populate automático
  }

  async findById(id) {
    return super.findById(id, ['client_id']); // populate automático
  }
}

export default new ContactModel();
