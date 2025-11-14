import PermissionAwareController from './PermissionAwareController.js';
import Area from '../models/AreaModel.js';

class AreaController extends PermissionAwareController {
    constructor() {
        super(Area, 'areas', 'areas', 'ARE-');
    }

    // TODO: Las áreas desactivadas no aparecen como opciones disponibles en la asignación de empleados.
}

export default new AreaController();
