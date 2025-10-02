import BaseController from './BaseController.js';
import TeamModel from '../models/TeamModel.js';
import User from '../models/UserModel.js';
import mongoose from 'mongoose';
import { filterManagers } from '../utils/userHelpers.js';
import { formatDatesForInput } from '../utils/dateHelpers.js';



class TeamController extends BaseController {
    constructor() {
        super(TeamModel, 'teams', 'TEM-');
    }


    // Vista de edición de un equipo
    getEditView = async (req, res) => {
        try {
            const { id } = req.params;
            const team = await this.model.findById(id);
            if (!team) return res.render('error404', { title: 'Equipo no encontrado' });

            const users = await User.findAll();
            const allUsers = await User.findAll();
            const managers = filterManagers(allUsers);

            // Cargar todos los roles de equipo disponibles
            const TeamRole = await import('../models/TeamRoleModel.js');
            const teamRoles = await TeamRole.default.findAll();

            const formattedTeam = formatDatesForInput(this.formatItem(team), ['created_at', 'updated_at']);


            // Filtrar usuarios disponibles (excluir líder y miembros actuales)
            const availableUsers = users.filter(user => {
                const isLeader = formattedTeam.team_leader && user._id.toString() === formattedTeam.team_leader._id.toString();
                const isMember = formattedTeam.members && formattedTeam.members.some(member =>
                    member.user_id._id.toString() === user._id.toString()
                );
                return !isLeader && !isMember;
            });

            res.render(`${this.viewPath}/edit`, {
                title: `Editar Equipo`,
                item: formattedTeam,
                users: availableUsers,
                allUsers: users,
                managers,
                teamRoles
            });
        } catch (error) {
            console.error('Error en getEditView:', error.message);
            res.status(500).render('error500', { title: 'Error del servidor' });
        }
    };

    // Vista de nuevo equipo
    newView = async (req, res) => {
        try {
            const users = await User.findAll();
            const managers = filterManagers(users);

            // Cargar todos los roles de equipo disponibles
            const TeamRole = await import('../models/TeamRoleModel.js');
            const teamRoles = await TeamRole.default.findAll();

            res.render(`${this.viewPath}/new`, {
                title: 'Crear Nuevo Equipo',
                item: {},
                users,
                managers,
                teamRoles
            });
        } catch (error) {
            console.error('Error en newView:', error.message);
            res.status(500).render('error500', { title: 'Error del servidor' });
        }
    };

    // Método updateView para consistencia con otros controladores
    updateView = async (req, res) => {
        try {
            const { id } = req.params;

            // console.log('=== INICIO UPDATE VIEW ===');
            // console.log('req.body completo:', JSON.stringify(req.body, null, 2));
            // console.log('Claves del body:', Object.keys(req.body));

            const { name, description, team_leader } = req.body;

            // Arreglar members_count - tomar el último valor si es array
            let membersCount = req.body.members_count;
            if (Array.isArray(membersCount)) {
                membersCount = membersCount[membersCount.length - 1];
            }

            if (!team_leader) {
                return res.status(400).send('Debe seleccionar un líder del equipo');
            }

            // Convertir team_leader a ObjectId
            const leaderId = mongoose.Types.ObjectId.createFromHexString(team_leader);

            // Procesar members usando el nuevo formato con team_role_id
            const finalMembersArray = [];
            const memberCount = parseInt(membersCount) || 0;

            // console.log(`Procesando ${memberCount} miembros (members_count original: ${JSON.stringify(req.body.members_count)})`);

            for (let i = 0; i < memberCount; i++) {
                const memberIdKey = `member_${i}_id`;
                const memberRoleKey = `member_${i}_role`;

                const memberId = req.body[memberIdKey];
                const memberTeamRoleId = req.body[memberRoleKey];

                // console.log(`Miembro ${i}: ID=${memberId}, TeamRoleId=${memberTeamRoleId}`);

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

            // console.log('Final members array:', JSON.stringify(finalMembersArray, null, 2));

            const updateData = {
                name,
                description,
                team_leader: leaderId,
                members: finalMembersArray
            };

            // console.log('Datos de actualización:', JSON.stringify(updateData, null, 2));

            const result = await this.model.update(id, updateData);

            // console.log('Resultado de la actualización:', result);
            res.redirect(`/teams/${id}`);

        } catch (error) {
            console.error('Error al actualizar team:', error.message);
            console.error('Stack completo:', error.stack);
            res.status(500).send(`Error: ${error.message}`);
        }
    };

    // Método createView para crear nuevos equipos
    // createView = async (req, res) => {
    //     try {

    //         console.log('=== INICIO CREATE VIEW ===');
    //         console.log('req.body completo:', JSON.stringify(req.body, null, 2));

    //         const { name, description, team_leader } = req.body;

    //         // Arreglar members_count - tomar el último valor si es array
    //         let membersCount = req.body.members_count;
    //         if (Array.isArray(membersCount)) {
    //             membersCount = membersCount[membersCount.length - 1];
    //         }

    //         if (!name || !team_leader) {
    //             return res.status(400).send('Nombre y líder del equipo son requeridos');
    //         }

    //         // Convertir team_leader a ObjectId
    //         const leaderId = mongoose.Types.ObjectId.createFromHexString(team_leader);

    //         // Procesar members
    //         const finalMembersArray = [];
    //         const memberCount = parseInt(membersCount) || 0;

    //         console.log(`Procesando ${memberCount} miembros (members_count original: ${JSON.stringify(req.body.members_count)})`);

    //         for (let i = 0; i < memberCount; i++) {
    //             const memberIdKey = `member_${i}_id`;
    //             const memberRoleKey = `member_${i}_role`;

    //             const memberId = req.body[memberIdKey];
    //             const memberTeamRoleId = req.body[memberRoleKey];

    //             console.log(`Miembro ${i}: ID=${memberId}, TeamRoleId=${memberTeamRoleId}`);

    //             if (memberId && memberTeamRoleId) {
    //                 try {
    //                     finalMembersArray.push({
    //                         user_id: mongoose.Types.ObjectId.createFromHexString(memberId),
    //                         team_role_id: mongoose.Types.ObjectId.createFromHexString(memberTeamRoleId)
    //                     });
    //                     console.log(`Miembro ${i} procesado correctamente`);
    //                 } catch (error) {
    //                     console.error(`Error procesando miembro ${i}:`, error.message);
    //                 }
    //             }
    //         }

    //         const createData = {
    //             name,
    //             description,
    //             team_leader: leaderId,
    //             members: finalMembersArray
    //         };

    //         console.log('Datos de creación:', JSON.stringify(createData, null, 2));

    //         const result = await this.model.create(createData);
    //         console.log('Resultado de la creación:', result);

    //         res.redirect(`/teams/${result._id}`);

    //     } catch (error) {
    //         console.error('Error al crear team:', error.message);
    //         res.status(500).send(`Error: ${error.message}`);
    //     }
    // };

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
            console.error('Error al crear team:', error.message);
            res.status(500).send(`Error: ${error.message}`);
        }
    };


}

export default new TeamController();