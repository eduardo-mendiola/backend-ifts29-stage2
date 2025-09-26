import BaseModel from './BaseModel.js';
import ProjectEntity from '../entities/ProjectEntity.js';
import IdGenerator from '../utils/IdGenerator.js';
import db from '../config/db.js';

// Generador de IDs para proyectos
const projectIdGen = new IdGenerator(db, 'projects');

class ProjectModel extends BaseModel {
    constructor() {
        super(
            'projects',
            ProjectEntity,
            [
                'id',
                'client_id',
                'name',
                'description',
                'start_date',
                'end_date',
                'budget',
                'billing_type',
                'status',
                'manager_id'
            ]
        );
        this.idGen = projectIdGen;
    }

    async create(data) {
        data.id = this.idGen.generateId();
        return super.create(data);
    }
}

export default new ProjectModel();