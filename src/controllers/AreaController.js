import BaseController from './BaseController.js';
import Area from '../models/AreaModel.js';

class AreaController extends BaseController {
    constructor() {
        super(Area, 'areas', 'ARE-');
    }
}

export default new AreaController();
