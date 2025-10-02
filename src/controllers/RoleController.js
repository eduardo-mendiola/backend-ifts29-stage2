import BaseController from './BaseController.js';
import Role from '../models/RoleModel.js';

class RoleController extends BaseController {
    constructor() {
        super(Role, 'roles', 'ROL-');
    }
}

export default new RoleController();
