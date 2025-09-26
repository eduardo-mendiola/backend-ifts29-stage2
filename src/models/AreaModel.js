import mongoose from 'mongoose';

const areaSchema = new mongoose.Schema({
    name_area: { type: String, required: true }
}, { 
    collection: 'areas'
});

export default mongoose.models.Area || mongoose.model('Area', areaSchema);
