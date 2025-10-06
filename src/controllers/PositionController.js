import BaseController from './BaseController.js';
import Position from '../models/PositionModel.js';

class PositionController extends BaseController {
    constructor() {
        super(Position, 'positions', 'POS-');
    }
}

export default new PositionController();
