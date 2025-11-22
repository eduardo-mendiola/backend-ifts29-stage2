import PermissionAwareController from './PermissionAwareController.js';
import User from '../models/UserModel.js';
import Employee from '../models/EmployeeModel.js';
import Role from '../models/RoleModel.js';
import Area from '../models/AreaModel.js';
import Position from '../models/PositionModel.js';
import { filterManagers } from '../utils/userHelpers.js';
import { formatDatesForInput } from '../utils/dateHelpers.js';

class UserController extends PermissionAwareController {
    constructor() {
        super(User, 'users', 'users', 'USR-');
    }

    // Sobrescribir createView para manejar roles temporales
    createView = async (req, res) => {
        try {
            // Verificar permisos
            if (!this.checkPermission(req, `create_${this.resourceName}`)) {
                return this.denyAccess(res);
            }

            // Convertir checkbox "on" a boolean
            if (req.body.is_temporary_role === 'on' || req.body.is_temporary_role === 'true' || req.body.is_temporary_role === true) {
                req.body.is_temporary_role = true;
                
                if (req.body.role_duration_value && req.body.role_duration_unit) {
                    req.body.role_expiration_date = User.calculateRoleExpiration(
                        req.body.role_duration_unit,
                        parseInt(req.body.role_duration_value)
                    );
                }
            } else {
                // Limpiar campos de rol temporal si no está activado
                req.body.is_temporary_role = false;
                req.body.role_expiration_date = null;
                req.body.role_duration_value = null;
                req.body.role_duration_unit = null;
                req.body.fallback_role_id = null;
            }

            // Convertir is_active de string a boolean
            if (req.body.is_active === 'true' || req.body.is_active === true) {
                req.body.is_active = true;
            } else if (req.body.is_active === 'false' || req.body.is_active === false) {
                req.body.is_active = false;
            }

            console.log('Datos procesados para crear:', req.body);

            const newItem = { ...req.body };

            // 1. Crear el documento SIN el código
            const createdItem = await this.model.create(newItem);

            // 2. Generar el código usando el ObjectId real del documento creado
            if (this.codePrefix) {
                const code = this.codeGenerator.generateCodeFromId(createdItem._id, this.codePrefix);
                // 3. Actualizar el documento con el código correcto
                await this.model.update(createdItem._id, { code });
            }

            console.log('✅ Usuario creado exitosamente con rol temporal');
            res.redirect(`/${this.viewPath}/${createdItem._id}`);
        } catch (error) {
            console.error('Error al crear usuario con rol temporal:', error.message);
            console.error('Stack:', error.stack);
            res.status(500).render('error500', { title: 'Error de servidor', message: error.message });
        }
    };

    // Sobrescribir updateView para manejar roles temporales
    updateView = async (req, res) => {
        try {
            // Verificar permisos
            if (!this.checkPermission(req, `edit_${this.resourceName}`)) {
                return this.denyAccess(res);
            }

            const { id } = req.params;
            
            // Convertir checkbox "on" a boolean
            if (req.body.is_temporary_role === 'on' || req.body.is_temporary_role === 'true' || req.body.is_temporary_role === true) {
                req.body.is_temporary_role = true;
                
                if (req.body.role_duration_value && req.body.role_duration_unit) {
                    req.body.role_expiration_date = User.calculateRoleExpiration(
                        req.body.role_duration_unit,
                        parseInt(req.body.role_duration_value)
                    );
                }
            } else {
                // Limpiar campos de rol temporal si no está activado
                req.body.is_temporary_role = false;
                req.body.role_expiration_date = null;
                req.body.role_duration_value = null;
                req.body.role_duration_unit = null;
                req.body.fallback_role_id = null;
            }

            // Convertir is_active de string a boolean
            if (req.body.is_active === 'true' || req.body.is_active === true) {
                req.body.is_active = true;
            } else if (req.body.is_active === 'false' || req.body.is_active === false) {
                req.body.is_active = false;
            }

            console.log('Datos procesados para actualizar:', req.body);
            
            // Actualizar directamente usando el modelo
            const updatedItem = await this.model.update(id, req.body);
            
            if (!updatedItem) {
                console.error('Item no encontrado para actualizar:', id);
                return res.render('error404', { title: `${this.viewPath} no encontrado para actualizar.` });
            }
            
            console.log('✅ Usuario actualizado exitosamente con rol temporal');
            res.redirect(`/${this.viewPath}/${id}`);
        } catch (error) {
            console.error('Error al actualizar usuario con rol temporal:', error.message);
            console.error('Stack:', error.stack);
            res.status(500).render('error500', { title: 'Error del servidor', message: error.message });
        }
    };

    // Sobrescribir delete para validar relación con empleado
    delete = async (req, res) => {
        try {
            const { id } = req.params;
            
            console.log('Intentando eliminar usuario:', id);
            
            // Buscar si existe un empleado asociado a este usuario
            const employees = await Employee.findAll();
            const associatedEmployee = employees.find(emp => 
                emp.user_id && emp.user_id.toString() === id.toString()
            );
            
            if (associatedEmployee) {
                console.log('Usuario tiene empleado asociado:', associatedEmployee._id);
                return res.status(400).json({ 
                    success: false,
                    message: 'No se puede eliminar este usuario porque tiene un empleado asociado. Elimine primero el empleado.' 
                });
            }

            console.log('Usuario no tiene empleado asociado, procediendo a eliminar...');
            
            // Si no tiene empleado asociado, permitir eliminar
            const deleted = await this.model.delete(id);
            
            if (!deleted) {
                return res.status(404).json({ 
                    success: false,
                    message: 'Usuario no encontrado o no se pudo eliminar.' 
                });
            }

            console.log('✅ Usuario eliminado exitosamente');
            res.status(204).send();
        } catch (error) {
            console.error('Error al eliminar usuario:', error.message);
            console.error('Stack:', error.stack);
            res.status(500).json({ 
                success: false,
                message: 'Error interno del servidor al eliminar usuario.' 
            });
        }
    };

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



