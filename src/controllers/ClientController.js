import BaseController from './BaseController.js';
import Client from '../models/ClientModel.js'; 

class ClientController extends BaseController {
    constructor() {
        super(Client, 'clients'); 
    }
}

export default new ClientController();
