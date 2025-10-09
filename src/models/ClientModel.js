import mongoose from 'mongoose';
import BaseModel from './BaseModel.js';

const addressSchema = new mongoose.Schema({
  street: String,
  city: String,
  state: String,
  postal_code: String,
  country: String,
  country_code: String
}, { _id: false });

const billingInfoSchema = new mongoose.Schema({
  payment_terms: String,
  currency: String,
  email: String
}, { _id: false });

const clientSchema = new mongoose.Schema({
  code: { type: String, unique: true },
  client_type: { type: String, enum: ['person', 'company'], required: true },
  name: { type: String },
  first_name: { type: String },
  last_name: { type: String },
  id_type: { type: String },
  id_number: { type: String },
  category: { type: String },
  company_type: { type: String },
  website: { type: String },
  phone: { type: String },
  address: addressSchema,
  billing_info: billingInfoSchema,
  is_active: { type: Boolean, default: true }
}, {
  collection: 'clients',
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  toObject: { virtuals: true },
  toJSON: { virtuals: true }
});


// Virtual populate: traer los contactos de este cliente
clientSchema.virtual('contacts', {
  ref: 'Contact',           // modelo referenciado
  localField: '_id',        // campo local (Client)
  foreignField: 'client_id' // campo en Contact
});

// Virtual auxiliar (lista de nombres de contactos)
clientSchema.virtual('contacts_names').get(function () {
  if (!this.contacts || this.contacts.length === 0) return 'Sin contactos';
  return this.contacts.map(c => `${c.first_name} ${c.last_name} - Código: ${c.code}`).join(', ');
});


class ClientModel extends BaseModel {
  constructor() {
    super(clientSchema, 'Client');
  }

  async findAll() {
    // populate automático con contactos
    return super.findAll(['contacts']);
  }

  async findById(id) {
    return super.findById(id, ['contacts']);
  }
}

export default new ClientModel();
