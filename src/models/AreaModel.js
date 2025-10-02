import mongoose from 'mongoose';
import BaseModel from './BaseModel.js';

const areaSchema = new mongoose.Schema({
    code: { type: String, unique: true },
    name_area: { type: String, required: true },
    description: { type: String }
}, { 
    collection: 'areas' 
});

class AreaModel extends BaseModel {
    constructor() {
        super(areaSchema, 'Area');
    }

    // more area-specific methods can be added here
}

export default new AreaModel();


