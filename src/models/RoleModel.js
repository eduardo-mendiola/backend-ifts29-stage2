import mongoose from 'mongoose';
import BaseModel from './BaseModel.js';

const roleSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String }
}, { 
    collection: 'roles' 
});

class RoleModel extends BaseModel {
    constructor() { 
        super(roleSchema, 'Role');
    }

    // more role-specific methods can be added here
}

export default new RoleModel();

