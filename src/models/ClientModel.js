import mongoose from 'mongoose';
import BaseModel from './BaseModel.js';

const clientSchema = new mongoose.Schema({
    name: { type: String, required: true },
    contact_name: { type: String },
    email: { type: String },
    phone: { type: String },
    address: { type: String },
    is_active: { type: Boolean, default: true }
}, {
    collection: 'clients',
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } // timestamps automáticos
});

class ClientModel extends BaseModel {
    constructor() {
        super(clientSchema, 'Client');
    }
}

export default new ClientModel();
