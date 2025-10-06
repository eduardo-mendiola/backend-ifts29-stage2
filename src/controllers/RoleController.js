import BaseController from './BaseController.js';
import Role from '../models/RoleModel.js';
import { allPermissions, permissionLabels } from '../config/permissions.js';


class RoleController extends BaseController {
    constructor() {
        super(Role, 'roles', 'ROL-');
    }

    // Sobrescribir getEditView para incluir permisos
    getEditView = async (req, res) => {
        try {
            const { id } = req.params;
            const role = await this.model.findById(id);
            if (!role) return res.render('error404', { title: 'Rol no encontrado' });

            
            res.render(`${this.viewPath}/edit`, {
                title: `Editar Rol`,
                item: role,
                allPermissions,
                permissionLabels
            });
        } catch (error) {
            console.error('Error en getEditView:', error.message);
            res.status(500).render('error500', { title: 'Error del servidor' });
        }
    };

    // Método para obtener todos los roles con permisos (opcional)
    getAllRolesWithPermissions = async () => {
        return this.model.findAllWithPermissions();
    };

    getByIdView = async (req, res) => {
        try {
            const { id } = req.params;
            const role = await this.model.findById(id);
            if (!role) return res.render('error404', { title: 'Rol no encontrado' });

           
            res.render(`${this.viewPath}/show`, {
                title: `Rol: ${role.name}`,
                item: role,
                permissionLabels
            });
        } catch (error) {
            console.error('Error en getShowView:', error.message);
            res.status(500).render('error500', { title: 'Error del servidor' });
        }
    };

}



export default new RoleController();




// import BaseController from './BaseController.js';
// import Role from '../models/RoleModel.js';

// class RoleController extends BaseController {
//     constructor() {
//         super(Role, 'roles', 'ROL-');
//     }
// }

// export default new RoleController();
