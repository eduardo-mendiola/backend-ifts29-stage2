import mongoose from 'mongoose';
import BaseModel from './BaseModel.js';

const areaSchema = new mongoose.Schema({
    name_area: { type: String, required: true }
}, { collection: 'areas' });

class AreaModel extends BaseModel {
    constructor() {
        super(areaSchema, 'Area');
    }

    // more area-specific methods can be added here
}

export default new AreaModel();

// import mongoose from 'mongoose';

// const areaSchema = new mongoose.Schema({
//     name_area: { type: String, required: true }
// }, { 
//     collection: 'areas'
// });

// export default mongoose.models.Area || mongoose.model('Area', areaSchema);
