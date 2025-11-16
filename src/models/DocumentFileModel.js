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

    async findByUserProjects(userId) {
        // 1. Encontrar el empleado asociado al usuario
        const Employee = mongoose.model('Employee');
        const employee = await Employee.findOne({ user_id: userId });
        
        if (!employee) {
            return [];
        }

        // Solo obtener documentos subidos por el empleado
        const query = { uploaded_by: employee._id };
        
        const documents = await this.model.find(query)
            .populate('project_id')
            .populate('uploaded_by');
        
        return documents;
    }
    
}

export default new DocumentModel();