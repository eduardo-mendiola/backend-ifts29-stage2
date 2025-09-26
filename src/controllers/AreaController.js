import BaseController from './BaseController.js';
import AreaModel from '../models/AreaModel.js';

class AreaController extends BaseController {
    constructor() {
        super(AreaModel, 'area');
    }
}

export default new AreaController();
