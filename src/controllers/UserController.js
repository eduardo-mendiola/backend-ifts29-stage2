import PermissionAwareController from './PermissionAwareController.js';
import User from '../models/UserModel.js';
import Role from '../models/RoleModel.js';
import Area from '../models/AreaModel.js';
import Position from '../models/PositionModel.js';
import { filterManagers } from '../utils/userHelpers.js';
import { formatDatesForInput } from '../utils/dateHelpers.js';

class UserController extends PermissionAwareController {
    constructor() {
        super(User, 'users', 'users', 'USR-');
    }

    // Sobrescribimos getEditView para incluir roles, áreas y supervisores
    getEditView = async (req, res) => {
        try {
            const { id } = req.params;
            const user = await this.model.findById(id); // populate automático (role_id, area_id, supervisor_id)
            if (!user) return res.render('error404', { title: 'Usuario no encontrado' });

            const allUsers = await User.findAll(); 
            const roles = await Role.findAll();
            const areas = await Area.findAll();
            const positions = await Position.findAll();
            const supervisors = await filterManagers(allUsers); 

            // enums disponibles
            const genderOptions = ['male', 'female', 'other'];
            const employmentTypes = ['full-time', 'part-time', 'contractor'];

            // Formatear fechas antes de enviar a la vista
            const formattedUser = formatDatesForInput(this.formatItem(user), ['birth_date', 'hire_date', 'last_login']);

            res.render(`${this.viewPath}/edit`, {
                title: `Editar Usuario`,
                item: formattedUser,
                roles,
                areas,
                positions,
                supervisors,
                genderOptions,
                employmentTypes
            });
        } catch (error) {
            console.error('Error en getEditView:', error.message);
            res.status(500).render('error500', { title: 'Error del servidor' });
        }
    };

    // Sobrescribimos newView para incluir listas y enums
    newView = async (req, res) => {
        try {
            const allUsers = await User.findAll();
            const roles = await Role.findAll();
            const areas = await Area.findAll();
            const positions = await Position.findAll();
            const supervisors = await filterManagers(allUsers); 

            const genderOptions = ['male', 'female', 'other'];
            const employmentTypes = ['full-time', 'part-time', 'contractor'];

            
            res.render(`${this.viewPath}/new`, {
                title: `Nuevo Usuario`,
                item: {},
                roles,
                areas,
                positions,
                supervisors,
                genderOptions,
                employmentTypes
            });
        } catch (error) {
            console.error('Error al abrir formulario de usuario:', error.message);
            res.status(500).render('error500', { title: 'Error de servidor' });
        }
    };
}

export default new UserController();



