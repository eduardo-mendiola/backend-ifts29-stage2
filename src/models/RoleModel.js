import BaseModel from './BaseModel.js';
import RoleEntity from '../entities/RoleEntity.js';
import IdGenerator from '../utils/IdGenerator.js';
import db from '../config/db.js';

const roleIdGen = new IdGenerator(db, 'roles');

class RoleModel extends BaseModel {
    constructor() {
        super(
            'roles',
            RoleEntity,
            ['id', 'name', 'description'] 
        );
        this.idGen = roleIdGen;
    }

    async create(data) {
        data.id = this.idGen.generateId();
        return super.create(data);  
    }

    async update(id, updateData) {
        return super.update(id, updateData); 
    }
}

export default new RoleModel();
