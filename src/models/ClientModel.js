import BaseModel from './BaseModel.js'; 
import ClientEntity from '../entities/ClientEntity.js'; 
import IdGenerator from '../utils/IdGenerator.js';
import db from '../config/db.js';

const clientIdGen = new IdGenerator(db, 'clients');

class ClientModel extends BaseModel {
    constructor() {
        super(
            'clients', 
            ClientEntity, 
            ['id','name','contact_name','email','phone','address','status'] 
        ); 
        this.idGen = clientIdGen;       
    }

    async create(data) {
        data.id = this.idGen.generateId();
        return super.create(data); 
    }
}

export default new ClientModel();
