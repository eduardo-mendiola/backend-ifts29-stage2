import mongoose from 'mongoose';
import BaseModel from './BaseModel.js';

const estimateSchema = new mongoose.Schema({
    code: { type: String, unique: true },
    project_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
    title: { type: String, required: true },
    description: { type: String },
    total_amount: { type: Number },
    status: { type: String, enum: ['draft', 'sent', 'viewed', 'accepted', 'rejected', 'expired', 'converted'], default: 'draft' },
    validity_days: { type: Number, default: 15 },
    valid_until: { type: Date },
}, {
    collection: 'estimates',
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

// Virtuals
estimateSchema.virtual('clientName').get(function() {
    return this.project_id?.client_id?.name || 'N/A';
});

estimateSchema.virtual('clientCode').get(function() {
    return this.project_id?.client_id?.code || 'N/A';
});

// Para incluir virtuals automáticamente al convertir a JSON u objeto
estimateSchema.set('toObject', { virtuals: true });
estimateSchema.set('toJSON', { virtuals: true });

class EstimateModel extends BaseModel {
    constructor() {
        super(estimateSchema, 'Estimate');
    }

    async findAll() {
        return super.findAll([
            {
                path: 'project_id',
                populate: { path: 'client_id' }
            }
        ]); // populate automático
    }

    async findById(id) {
        return super.findById(id, [
            {
                path: 'project_id',
                populate: { path: 'client_id' }
            }
        ]);
    }

}

export default new EstimateModel();
