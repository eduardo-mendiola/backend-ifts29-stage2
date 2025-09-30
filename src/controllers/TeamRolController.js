import BaseController from './BaseController.js';
import TeamRoleModel from '../models/TeamRoleModel.js';

class TeamRoleController extends BaseController {
    constructor() {
        super(TeamRoleModel, 'teamrole');
    }

    // Solo sobreescribir updateView para validar nombres únicos
    updateView = async (req, res) => {
        try {
            const { id } = req.params;
            const { name, description } = req.body;

            // Validación específica: nombre requerido
            if (!name || name.trim() === '') {
                return res.status(400).send('El nombre del rol es requerido');
            }

            // Validación específica: nombre único
            const existingRole = await this.model.findByName(name.trim());
            if (existingRole && existingRole._id.toString() !== id) {
                return res.status(400).send('Ya existe un rol de equipo con ese nombre');
            }

            // Usar el updateView del BaseController
            req.body.name = name.trim();
            req.body.description = description ? description.trim() : '';
            
            return super.updateView(req, res);

        } catch (error) {
            console.error('Error al actualizar rol de equipo:', error.message);
            res.status(500).send(`Error: ${error.message}`);
        }
    };

    // Solo sobreescribir createView para validar nombres únicos
    createView = async (req, res) => {
        try {
            const { name, description } = req.body;

            // Validación específica: nombre requerido
            if (!name || name.trim() === '') {
                return res.status(400).send('El nombre del rol es requerido');
            }

            // Validación específica: nombre único
            const existingRole = await this.model.findByName(name.trim());
            if (existingRole) {
                return res.status(400).send('Ya existe un rol de equipo con ese nombre');
            }

            // Usar el createView del BaseController
            req.body.name = name.trim();
            req.body.description = description ? description.trim() : '';
            
            return super.createView(req, res);

        } catch (error) {
            console.error('Error al crear rol de equipo:', error.message);
            res.status(500).send(`Error: ${error.message}`);
        }
    };

    // Solo sobreescribir deleteView para verificar si está en uso
    deleteView = async (req, res) => {
        try {
            const { id } = req.params;

            // Verificar si el rol está siendo usado en algún equipo
            const TeamModel = await import('../models/TeamModel.js');
            const teamsUsingRole = await TeamModel.default.model.find({
                'members.team_role_id': id
            });

            if (teamsUsingRole.length > 0) {
                return res.status(400).send('No se puede eliminar el rol porque está siendo usado en equipos');
            }

            // Usar el método delete del BaseController (API)
            const deleted = await this.model.delete(id);
            if (!deleted) {
                return res.status(404).send('Rol no encontrado');
            }
            
            res.redirect('/teamroles');

        } catch (error) {
            console.error('Error al eliminar rol de equipo:', error.message);
            res.status(500).send(`Error: ${error.message}`);
        }
    };
}

export default new TeamRoleController();