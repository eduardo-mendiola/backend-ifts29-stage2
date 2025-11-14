import PermissionAwareController from './PermissionAwareController.js';
import Position from '../models/PositionModel.js';

class PositionController extends PermissionAwareController {
    constructor() {
        super(Position, 'positions', 'positions', 'POS-');
    }
}

export default new PositionController();
