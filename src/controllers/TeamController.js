import BaseController from './BaseController.js';
import Team from '../models/TeamModel.js';
import User from '../models/UserModel.js';
import mongoose from 'mongoose';

class TeamController extends BaseController {
    constructor() {
        super(Team, 'team');
    }

    // Método helper para filtrar managers
    filterManagers = (users) => {
        return users.filter(user =>
            user.role_id &&
            user.role_id._id &&
            user.role_id._id.toString() === '66f80e051a7b4f5d02e86e02' &&
            user.is_active === true
        );
    }

    // Método helper para formatear fechas (para inputs de tipo date)
    formatDatesForInput = (item) => {
        const formatDate = (date) => {
            if (!date) return '';
            const d = new Date(date);
            return d.toISOString().split('T')[0]; // YYYY-MM-DD
        };

        return {
            ...item,
            created_at: formatDate(item.created_at),
            updated_at: formatDate(item.updated_at)
        };
    }

    // // Vista de edición de un equipo
    // getEditView = async (req, res) => {
    //     try {
    //         const { id } = req.params;
    //         const team = await this.model.findById(id);
    //         if (!team) return res.render('error404', { title: 'Equipo no encontrado' });

    //         const users = await User.findAll();
    //         const allUsers = await User.findAll();
    //         const managers = this.filterManagers(allUsers);

    //         const formattedTeam = this.formatDatesForInput(this.formatItem(team));

    //         res.render(`${this.viewPath}/edit`, {
    //             title: `Editar Equipo`,
    //             item: formattedTeam,
    //             users,
    //             managers
    //         });
    //     } catch (error) {
    //         console.error('Error en getEditView:', error.message);
    //         res.status(500).render('error500', { title: 'Error del servidor' });
    //     }
    // };

    // ...existing code...

// Vista de edición de un equipo
getEditView = async (req, res) => {
    try {
        const { id } = req.params;
        const team = await this.model.findById(id);
        if (!team) return res.render('error404', { title: 'Equipo no encontrado' });

        const users = await User.findAll();
        const allUsers = await User.findAll();
        const managers = this.filterManagers(allUsers);

        const formattedTeam = this.formatDatesForInput(this.formatItem(team));
        
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
            managers
        });
    } catch (error) {
        console.error('Error en getEditView:', error.message);
        res.status(500).render('error500', { title: 'Error del servidor' });
    }
};

// ...existing code...

    // Vista de nuevo equipo
    newView = async (req, res) => {
        try {
            const users = await User.findAll();
            const allUsers = await User.findAll();
            const managers = this.filterManagers(allUsers);

            res.render(`${this.viewPath}/form`, {
                title: `Nuevo Equipo`,
                item: {},
                users,
                managers
            });
        } catch (error) {
            console.error('Error al abrir formulario de equipos:', error.message);
            res.status(500).render('error500', { title: 'Error de servidor' });
        }
    };



   // ...existing code...

// Método updateView para consistencia con otros controladores
updateView = async (req, res) => {
    try {
        const { id } = req.params;

        console.log('=== INICIO UPDATE VIEW ===');
        console.log('req.body completo:', JSON.stringify(req.body, null, 2));
        console.log('Claves del body:', Object.keys(req.body));

        const { name, description, team_leader } = req.body;

        if (!team_leader) {
            return res.status(400).send('Debe seleccionar un líder del equipo');
        }

        // Convertir team_leader a ObjectId
        const leaderId = mongoose.Types.ObjectId.createFromHexString(team_leader);

        // Procesar members
        let membersArray = [];

        console.log('Buscando campos de members...');

        // Buscar todos los campos que contengan 'members'
        Object.keys(req.body).forEach(key => {
            console.log(`Procesando clave: ${key}, valor: ${req.body[key]}`);
            if (key.includes('members') && req.body[key]) {
                console.log(`Campo de member encontrado: ${key} = ${req.body[key]}`);
                
                // Si el valor es un array, agregar cada elemento
                if (Array.isArray(req.body[key])) {
                    console.log('Valor es array, agregando elementos individuales');
                    req.body[key].forEach(memberValue => {
                        if (memberValue) {
                            membersArray.push(memberValue);
                        }
                    });
                } else {
                    // Si es un string, agregarlo directamente
                    membersArray.push(req.body[key]);
                }
            }
        });

        console.log('Members array extraído:', membersArray);

        // Si hay members, procesarlos
        const finalMembersArray = [];
        if (membersArray.length > 0) {
            console.log('Procesando members...');
            const users = await User.findAll();
            console.log(`${users.length} usuarios encontrados`);

            for (const memberId of membersArray) {
                console.log(`Procesando member ID: ${memberId}, tipo: ${typeof memberId}`);
                
                // Asegurarse de que memberId es un string
                const memberIdString = Array.isArray(memberId) ? memberId[0] : memberId;
                
                if (memberIdString && typeof memberIdString === 'string' && memberIdString.trim() !== '') {
                    const user = users.find(u => u._id.toString() === memberIdString.toString());
                    if (user) {
                        console.log(`Usuario encontrado: ${user.first_name} ${user.last_name}`);
                        finalMembersArray.push({
                            user_id: mongoose.Types.ObjectId.createFromHexString(memberIdString),
                            role_in_team: user.role_id ? user.role_id.name : 'Pendiente'
                        });
                    } else {
                        console.log(`Usuario no encontrado para ID: ${memberIdString}`);
                    }
                } else {
                    console.log(`ID de member inválido: ${memberIdString}`);
                }
            }
        }

        console.log('Final members array:', JSON.stringify(finalMembersArray, null, 2));

        const updateData = {
            name,
            description,
            team_leader: leaderId,
            members: finalMembersArray
        };

        console.log('Datos de actualización:', JSON.stringify(updateData, null, 2));

        // Usar el método update del BaseModel que sí existe
        const result = await this.model.update(id, updateData);

        console.log('Resultado de la actualización:', result);
        res.redirect(`/teams/${id}`);

    } catch (error) {
        console.error('Error al actualizar team:', error.message);
        console.error('Stack completo:', error.stack);
        res.status(500).send(`Error: ${error.message}`);
    }
};

// ...existing code...

}

export default new TeamController();
