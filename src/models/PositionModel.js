import mongoose from 'mongoose';
import BaseModel from './BaseModel.js';

const positionSchema = new mongoose.Schema({
    code: { type: String, unique: true },
    name: { type: String, required: true },
    description: { type: String }
}, { 
    collection: 'positions',
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

class PositionModel extends BaseModel {
    constructor() {
        super(positionSchema, 'Position');
    }

    // more area-specific methods can be added here
}

export default new PositionModel();


