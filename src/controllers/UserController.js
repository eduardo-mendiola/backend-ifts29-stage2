import BaseController from './BaseController.js';
import User from '../models/UserModel.js';
import Role from '../models/RoleModel.js';
import Area from '../models/AreaModel.js';

class UserController extends BaseController {
    constructor() {
        super(User, 'users', 'USR-');
    }

    // Sobrescribimos getEditView para incluir roles y áreas
    getEditView = async (req, res) => {
        try {
            const { id } = req.params;
            const user = await this.model.findById(id); // populate ya trae role_id y area_id
            if (!user) return res.render('error404', { title: 'Usuario no encontrado' });

            const roles = await Role.findAll(); 
            const areas = await Area.findAll(); 

            res.render(`${this.viewPath}/edit`, {
                title: `Editar Usuario`,
                item: this.formatItem(user), // obj con role_name y area_name
                roles,
                areas
            });
        } catch (error) {
            console.error('Error en getEditView:', error.message);
            res.status(500).render('error500', { title: 'Error del servidor' });
        }
    };

    newView = async (req, res) => {
        try {
            const roles = await Role.findAll();
            const areas = await Area.findAll();

            res.render(`${this.viewPath}/new`, {
                title: `Nuevo Usuario`,
                item: {}, // objeto vacío porque es nuevo
                roles,
                areas
            });
        } catch (error) {
            console.error('Error al abrir formulario de usuario:', error.message);
            res.status(500).render('error500', { title: 'Error de servidor' });
        }
    };
}

export default new UserController();
