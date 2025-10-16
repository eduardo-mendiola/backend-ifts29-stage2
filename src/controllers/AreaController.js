import BaseController from './BaseController.js';
import Area from '../models/AreaModel.js';

class AreaController extends BaseController {
    constructor() {
        super(Area, 'areas', 'ARE-');
    }

    // TODO: Las áreas desactivadas no aparecen como opciones disponibles en la asignación de empleados.
}

export default new AreaController();
