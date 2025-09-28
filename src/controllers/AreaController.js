import BaseController from './BaseController.js';
import Area from '../models/AreaModel.js';

class AreaController extends BaseController {
    constructor() {
        super(Area, 'area');
    }
}

export default new AreaController();
