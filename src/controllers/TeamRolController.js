import PermissionAwareController from './PermissionAwareController.js';
import TeamRoleModel from '../models/TeamRoleModel.js';

class TeamRoleController extends PermissionAwareController {
    constructor() {
        super(TeamRoleModel, 'team-roles', 'team_roles', 'TRL-');
    }

    
    // Sobrescribimos createView
    createView = async (req, res) => {
        try {
            const { name, description } = req.body;

            if (!name || name.trim() === '') {
                return res.status(400).json({ success: false, message: 'El nombre del rol es requerido' });
            }

            // Verificar nombre duplicado
            const existingRole = await this.model.findByName(name.trim());
            if (existingRole) {
                return res.status(400).json({ success: false, message: 'Nombre de rol existente, intente otro' });
            }

            // 1️ Crear el documento sin código
            const created = await this.model.create({
                name: name.trim(),
                description: description ? description.trim() : '',
                code: 'TEMP-' + new Date().getTime() // valor temporal único para evitar duplicados
            });

            // 2️ Generar código definitivo
            if (this.codePrefix) {
                const code = this.codeGenerator.generateCodeFromId(created._id, this.codePrefix);
                await this.model.update(created._id, { code });
                created.code = code; // para que la respuesta JSON lo incluya
            }

            // 3️ Responder con éxito
            return res.status(201).json({
                success: true,
                message: 'Rol creado correctamente',
                redirectUrl: `/team-roles/${created._id}`,
                data: created
            });

        } catch (error) {
            console.error('Error al crear rol de equipo:', error.message);
            return res.status(500).json({ success: false, message: 'Error interno al crear el rol' });
        }
    };



    // Sobrescribimos updateView
    updateView = async (req, res) => {
        try {
            const { id } = req.params;
            const { name, description } = req.body;

            if (!name || name.trim() === '') {
                return res.status(400).json({ success: false, message: 'El nombre del rol es requerido' });
            }

            const existingRole = await this.model.findByName(name.trim(), id);
            if (existingRole) {
                return res.status(400).json({ success: false, message: 'Ya existe un rol de equipo con ese nombre' });
            }

            const updated = await this.model.update(id, {
                name: name.trim(),
                description: description ? description.trim() : ''
            });

            if (!updated) {
                return res.status(404).json({ success: false, message: 'Rol no encontrado' });
            }

            return res.status(200).json({ success: true, message: 'Rol actualizado correctamente', data: updated });

        } catch (error) {
            console.error('Error al actualizar rol de equipo:', error.message);
            return res.status(500).json({ success: false, message: 'Error interno al actualizar el rol' });
        }
    }



    // Solo sobreescribir deleteView para verificar si está en uso

    delete = async (req, res) => {
        try {
            const { id } = req.params;
            const TeamModel = (await import('../models/TeamModel.js')).default;

            // Buscar equipos que usen este rol
            const teamsUsingRole = await TeamModel.model.find({
                members: { $elemMatch: { 'team_role_id._id': id } }
            });

            if (teamsUsingRole.length > 0) {
                return res.status(400).json({ message: 'No se puede eliminar el rol porque está siendo usado en equipos' });
            }

            const deleted = await this.model.delete(id);
            if (!deleted) return res.status(404).json({ message: 'Rol no encontrado' });

            res.status(204).send();

        } catch (error) {
            console.error('Error al eliminar rol de equipo:', error.message);
            res.status(500).json({ message: 'Error interno del servidor al eliminar.' });
        }
    };



}

export default new TeamRoleController();