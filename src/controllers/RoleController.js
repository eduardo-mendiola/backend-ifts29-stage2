import BaseController from './BaseController.js';
import Role from '../models/RoleModel.js';

class RoleController extends BaseController {
    constructor() {
        super(Role, 'role');
    }
}

export default new RoleController();
