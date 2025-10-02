import BaseController from './BaseController.js'
import Project from '../models/ProjectModel.js';
import Client from '../models/ClientModel.js';
import Team from '../models/TeamModel.js';
import User from '../models/UserModel.js';
import mongoose from 'mongoose';
import { filterManagers } from '../utils/userHelpers.js';
import { formatDatesForInput } from '../utils/dateHelpers.js';

class ProjectController extends BaseController {
    constructor() {
        super(Project, 'projects', 'PRJ-');
    }

    // Vista de edición de un proyecto
    getEditView = async (req, res) => {
        try {
            const { id } = req.params;
            const project = await this.model.findById(id);
            if (!project) return res.render('error404', { title: 'Proyecto no encontrado' });

            // Traer todos los usuarios para filtrar managers
            const allUsers = await User.findAll();
            const managers = filterManagers(allUsers);

            // Traer todos los equipos disponibles
            const allTeams = await Team.findAll();

            // Traer todos los clientes disponibles
            const clients = await Client.findAll();

            // Formatear fechas para inputs HTML
            const formattedProject = formatDatesForInput(this.formatItem(project), ['start_date', 'end_date']);

            // Armar lista de IDs de equipos actuales para marcar en el select
            const selectedTeamIds = formattedProject.teams.map(t => t.team_id._id.toString());

            res.render(`${this.viewPath}/edit`, {
                title: `Editar Proyecto`,
                item: formattedProject,
                managers,
                allTeams,
                clients,
                selectedTeamIds
            });
        } catch (error) {
            console.error('Error en getEditView:', error.message);
            res.status(500).render('error500', { title: 'Error del servidor' });
        }
    };


    // Método updateView para actualizar un proyecto
    updateView = async (req, res) => {
        try {
            const { id } = req.params;
            const {
                name,
                description,
                project_manager,
                client_id,
                start_date,
                end_date,
                budget,
                billing_type,
                status
            } = req.body;

            // Validar Project Manager
            if (!project_manager) {
                return res.status(400).send('Debe seleccionar un Project Manager');
            }

            const managerId = mongoose.Types.ObjectId.createFromHexString(project_manager);

            // Validar y convertir client_id si existe
            let clientObjectId = null;
            if (client_id) {
                clientObjectId = mongoose.Types.ObjectId.createFromHexString(client_id);
            }

            // Procesar equipos asignados dinámicamente
            const teamsCount = parseInt(req.body.teams_count) || 0;
            const teamsArray = [];
            for (let i = 0; i < teamsCount; i++) {
                const teamId = req.body[`team_${i}`];
                if (teamId) {
                    teamsArray.push({ team_id: mongoose.Types.ObjectId.createFromHexString(teamId) });
                }
            }

            // Armar datos de actualización
            const updateData = {
                name,
                description,
                project_manager: managerId,
                client_id: clientObjectId,
                start_date: start_date || null,
                end_date: end_date || null,
                budget: budget ? parseFloat(budget) : 0,
                billing_type: billing_type || 'fixed',
                status: status || 'pending',
                teams: teamsArray
            };

            // Actualizar en la base de datos
            const result = await this.model.update(id, updateData);

            res.redirect(`/projects/${id}`);
        } catch (error) {
            console.error('Error al actualizar project:', error.message);
            console.error('Stack completo:', error.stack);
            res.status(500).send(`Error: ${error.message}`);
        }
    };



    // Vista de nuevo equipo
    newView = async (req, res) => {
        try {
            const teams = await User.findAll();
            const managers = filterManagers(teams);

            // Cargar todos los roles de equipo disponibles
            const TeamRole = await import('../models/TeamRoleModel.js');
            const teamRoles = await TeamRole.default.findAll();

            res.render(`${this.viewPath}/new`, {
                title: 'Crear Nuevo Equipo',
                item: {},
                teams,
                managers,
                teamRoles
            });
        } catch (error) {
            console.error('Error en newView:', error.message);
            res.status(500).render('error500', { title: 'Error del servidor' });
        }
    };

    // Método createView para crear nuevos equipos
    createView = async (req, res) => {
        try {
            console.log('=== INICIO CREATE VIEW ===');
            console.log('req.body completo:', JSON.stringify(req.body, null, 2));

            const { name, description, team_leader } = req.body;

            // Arreglar members_count - tomar el último valor si es array
            let membersCount = req.body.members_count;
            if (Array.isArray(membersCount)) {
                membersCount = membersCount[membersCount.length - 1];
            }

            if (!name || !team_leader) {
                return res.status(400).send('Nombre y líder del equipo son requeridos');
            }

            // Convertir team_leader a ObjectId
            const leaderId = mongoose.Types.ObjectId.createFromHexString(team_leader);

            // Procesar members
            const finalMembersArray = [];
            const memberCount = parseInt(membersCount) || 0;

            console.log(`Procesando ${memberCount} miembros (members_count original: ${JSON.stringify(req.body.members_count)})`);

            for (let i = 0; i < memberCount; i++) {
                const memberIdKey = `member_${i}_id`;
                const memberRoleKey = `member_${i}_role`;

                const memberId = req.body[memberIdKey];
                const memberTeamRoleId = req.body[memberRoleKey];

                console.log(`Miembro ${i}: ID=${memberId}, TeamRoleId=${memberTeamRoleId}`);

                if (memberId && memberTeamRoleId) {
                    try {
                        finalMembersArray.push({
                            user_id: mongoose.Types.ObjectId.createFromHexString(memberId),
                            team_role_id: mongoose.Types.ObjectId.createFromHexString(memberTeamRoleId)
                        });
                        console.log(`Miembro ${i} procesado correctamente`);
                    } catch (error) {
                        console.error(`Error procesando miembro ${i}:`, error.message);
                    }
                }
            }

            // 🔹 1. Crear el documento SIN el código
            const createData = {
                name,
                description,
                team_leader: leaderId,
                members: finalMembersArray,
                code: new mongoose.Types.ObjectId().toString()  // valor único temporal
            };

            console.log('Datos de creación:', JSON.stringify(createData, null, 2));
            const createdItem = await this.model.create(createData);

            //  2. Generar el código usando el ObjectId real
            if (this.codePrefix) {
                const code = this.codeGenerator.generateCodeFromId(createdItem._id, this.codePrefix);
                await this.model.update(createdItem._id, { code });
            }

            console.log('Equipo creado con ID y code:', createdItem._id);

            // 🔹 3. Redirigir al detalle
            res.redirect(`/teams/${createdItem._id}`);

        } catch (error) {
            console.error('Error al crear project:', error.message);
            res.status(500).send(`Error: ${error.message}`);
        }
    };






    // ###################################################################################################################

    // // Sobrescribimos getEditView para incluir roles y áreas
    // getEditView = async (req, res) => {
    //     try {
    //         const { id } = req.params;
    //         const project = await this.model.findById(id);
    //         if (!project) return res.render('error404', { title: 'Proyecto no encontrado' });

    //         const clients = await Client.findAll(); 
    //         const teams = await Team.findAll();


    //         // Formatear fechas antes de enviar a la vista
    //         const formattedProject = formatDatesForInput(this.formatItem(project), ['start_date', 'end_date']);

    //         res.render(`${this.viewPath}/edit`, {
    //             title: `Editar Proyecto`,
    //             item: formattedProject, // Proyecto con fechas formateadas
    //             clients,
    //             teams
    //         });
    //     } catch (error) {
    //         console.error('Error en getEditView:', error.message);
    //         res.status(500).render('error500', { title: 'Error del servidor' });
    //     }
    // };

    // newView = async (req, res) => {
    //     try {
    //         const clients = await Client.findAll();
    //         const teams = await Team.findAll();

    //         res.render(`${this.viewPath}/new`, {
    //             title: `Nuevo Proyecto`,
    //             item: {}, // objeto vacío porque es nuevo
    //             clients,
    //             teams
    //         });
    //     } catch (error) {
    //         console.error('Error al abrir formulario de proyecto:', error.message);
    //         res.status(500).render('error500', { title: 'Error de servidor' });
    //     }
    // };
}

export default new ProjectController();