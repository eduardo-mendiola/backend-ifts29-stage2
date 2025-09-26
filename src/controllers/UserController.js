import BaseController from './BaseController.js';
import User from '../models/UserModel.js';

class UserController extends BaseController {
    constructor() {
        super(User, 'user');
    }
}

export default new UserController();

