import mongoose from 'mongoose';
import BaseModel from './BaseModel.js';


const FILE_CATEGORIES = [
  'document', 'spreadsheet', 'presentation', 'image', 
  'video', 'audio', 'compressed', 'link', 'other'
];

const documentFileSchema = new mongoose.Schema({
    code: { type: String, unique: true },
    project_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Project' },
    uploaded_by: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee', required: true },
    title: { type: String },
    file_url: { type: String },
    category: { type: String, enum: FILE_CATEGORIES, default: '' },
}, {
    collection: 'document_files',
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } // timestamps automáticos
});

class DocumentModel extends BaseModel {
    constructor() {
        super(documentFileSchema, 'DocumentFile'); // Nombre del modelo único
    }

    async findAll() {
        return super.findAll([
            'project_id', 
            'uploaded_by'
        ]); // populate automático
    }   

    async findById(id) {
        return super.findById(id, [
            'project_id', 
            'uploaded_by'
        ]); // populate automático
    }
    
}

export default new DocumentModel();