import BaseController from './BaseController.js';
import Client from '../models/ClientModel.js'; 

class ClientController extends BaseController {
    constructor() {
        super(Client, 'client'); 
    }
}

export default new ClientController();
