import mongoose from 'mongoose';

const roleSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String }
}, { 
    collection: 'roles'
});

export default mongoose.models.Role || mongoose.model('Role', roleSchema);
