import BaseController from './BaseController.js';
import Contact from '../models/ContactModel.js'; 

class ContactController extends BaseController {
    constructor() {
        super(Contact, 'contacts', 'CON-'); 
    }
}

export default new ContactController();
