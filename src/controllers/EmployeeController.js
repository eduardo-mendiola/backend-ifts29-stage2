import BaseController from './BaseController.js';
import Employee from '../models/EmployeeModel.js';
import User from '../models/UserModel.js';
import Role from '../models/RoleModel.js';
import Area from '../models/AreaModel.js';
import Position from '../models/PositionModel.js';
import { filterManagers } from '../utils/userHelpers.js';
import { formatDatesForInput } from '../utils/dateHelpers.js';


class EmployeeController extends BaseController {
    constructor() {
        super(Employee, 'employees', 'EMP-');
    }

    // Sobrescribimos getEditView para incluir roles, áreas y supervisores
    getEditView = async (req, res) => {
        try {
            const { id } = req.params;
            const employee = await this.model.findById(id); // populate automático (role_id, area_id, supervisor_id)
            if (!employee) return res.render('error404', { title: 'Empleado no encontrado' });

            // const allUsers = await User.findAll();
            const allEmployees = await Employee.findAll();
            const areas = await Area.findAll();
            const roles = await Role.findAll();
            const positions = await Position.findAll();
            const supervisors = await filterManagers(allEmployees);


            // enums disponibles
            const genderOptions = ['male', 'female', 'other'];
            const employmentTypes = ['full-time', 'part-time', 'contractor'];

            // Formatear fechas antes de enviar a la vista
            const formattedEmployee = formatDatesForInput(this.formatItem(employee), ['birth_date', 'hire_date', 'last_login']);

            res.render(`${this.viewPath}/edit`, {
                title: `Editar Empleado`,
                item: formattedEmployee,
                areas,
                roles,
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
            // const allUsers = await User.findAll();
            const allEmployees = await Employee.findAll();
            const areas = await Area.findAll();
            const roles = await Role.findAll();
            const positions = await Position.findAll();
            const supervisors = await filterManagers(allEmployees);
            const genderOptions = ['male', 'female', 'other'];
            const employmentTypes = ['full-time', 'part-time', 'contractor'];

             
            res.render(`${this.viewPath}/new`, {
                title: `Nuevo Empleado`,
                item: {},
                areas,
                roles,
                positions,
                supervisors,
                genderOptions,
                employmentTypes
            });
        } catch (error) {
            console.error('Error al abrir formulario de empleados:', error.message);
            res.status(500).render('error500', { title: 'Error de servidor' });
        }
    };

    createView = async (req, res) => {
        try {
            const {
                username,
                password_hash,
                email,
                role_id,
                first_name,
                last_name,
                dni,
                phone,
                area_id,
                nationality,
                birth_date,
                gender,
                hire_date,
                position_id,
                employment_type,
                supervisor_id,
                profile_image,
                monthly_salary,
                is_active
            } = req.body;

            //  Construir la dirección a partir de los campos del formulario
            const address = {
                street: req.body['address.street'],
                number: req.body['address.number'],
                postal_code: req.body['address.postal_code'],
                city: req.body['address.city'],
                province: req.body['address.province'], // ojo que en tu schema se llama "province"
                country: req.body['address.country']
            };

            const last_login = null; // Establecer last_login como null al crear un nuevo usuario

            // 1️ Crear User con código temporal
            const newUser = await User.create({
                username,
                password_hash,
                email,
                role_id,
                code: 'TEMP-' + new Date().getTime(),
                last_login
            });

            // 2️ Generar código definitivo para User
            if (this.codePrefix) {
                const userCode = this.codeGenerator.generateCodeFromId(newUser._id, this.codePrefix);
                await User.update(newUser._id, { code: userCode });
                newUser.code = userCode;
            }

            // 3️ Crear Employee con código temporal y user_id
            const newEmployee = await Employee.create({
                first_name,
                last_name,
                dni,
                phone,
                area_id,
                nationality,
                birth_date,
                address, // ✅ ahora sí es un objeto válido
                gender,
                hire_date,
                position_id,
                employment_type,
                supervisor_id,
                profile_image,
                monthly_salary,
                is_active,
                user_id: newUser._id,
                code: 'TEMP-' + new Date().getTime()
            });

            // 4️ Generar código definitivo para Employee
            if (this.codePrefix) {
                const empCode = this.codeGenerator.generateCodeFromId(newEmployee._id, this.codePrefix);
                await Employee.update(newEmployee._id, { code: empCode });
                newEmployee.code = empCode;
            }

            // 5️ Redirigir al listado
            res.redirect('/employees');

        } catch (error) {
            console.error('Error al crear empleado:', error.message);
            res.status(500).render('error500', { title: 'Error de servidor' });
        }
    };


    updateView = async (req, res) => {
        try {
            const { id } = req.params; // id del Employee
            const {
                username,
                password_hash,
                email,
                role_id,
                first_name,
                last_name,
                dni,
                phone,
                area_id,
                nationality,
                birth_date,
                gender,
                hire_date,
                position_id,
                employment_type,
                supervisor_id,
                profile_image,
                monthly_salary,
                is_active
            } = req.body;

            // Reconstruir la dirección
            const address = {
                street: req.body['address.street'],
                number: req.body['address.number'],
                postal_code: req.body['address.postal_code'],
                city: req.body['address.city'],
                province: req.body['address.province'],
                country: req.body['address.country']
            };

            // 1️ Obtener el Employee existente
            const employee = await Employee.findById(id);
            if (!employee) return res.status(404).render('error404', { title: 'Empleado no encontrado' });

            // 2️ Actualizar User vinculado
            await User.update(employee.user_id, {
                username,
                password_hash,
                email,
                role_id
            });

            // 3️ Actualizar Employee
            await Employee.update(id, {
                first_name,
                last_name,
                dni,
                phone,
                area_id,
                nationality,
                birth_date,
                address,
                gender,
                hire_date,
                position_id,
                employment_type,
                supervisor_id,
                profile_image,
                monthly_salary,
                is_active
            });

            // 4 Redirigir al listado de empleados
            res.redirect('/employees');

        } catch (error) {
            console.error('Error al actualizar empleado:', error.message);
            res.status(500).render('error500', { title: 'Error del servidor' });
        }
    };



}


export default new EmployeeController();