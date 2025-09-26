import BaseModel from './BaseModel.js';
import UserEntity from '../entities/UserEntity.js';
import IdGenerator from '../utils/IdGenerator.js';
import db from '../config/db.js';

const userIdGen = new IdGenerator(db, 'users');

class UserModel extends BaseModel {
    constructor() {
        super(
            'users',
            UserEntity,
            ['id', 'first_name', 'last_name', 'email', 'password_hash', 'phone', 'role_id', 'area_id', 'monthly_salary', 'status', 'created_at', 'updated_at']
        );
        this.idGen = userIdGen;
    }

    // Sobrescribir create para usar el ID generado
    async create(data) {
        data.id = this.idGen.generateId();
        const timestamp = new Date().toISOString();
        data.created_at = timestamp;
        data.updated_at = timestamp;
        return super.create(data);
    }

    // Sobrescribir update para actualizar timestamp
    async update(id, updateData) {
        updateData.updated_at = new Date().toISOString();
        return super.update(id, updateData);
    }
}

export default new UserModel();
