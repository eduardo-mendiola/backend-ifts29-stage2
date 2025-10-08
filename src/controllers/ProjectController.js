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
      // Traer todos los usuarios para filtrar managers
      const allUsers = await User.findAll();
      const managers = filterManagers(allUsers);

      // Traer todos los equipos disponibles
      const allTeams = await Team.findAll();

      // Traer todos los clientes disponibles
      const clients = await Client.findAll();

      // // Armar lista de IDs de equipos actuales para marcar en el select
      // const selectedTeamIds = formattedProject.teams.map(t => t.team_id._id.toString());

      res.render(`${this.viewPath}/new`, {
        title: `Crear Nuevo Proyecto`,
        item: {}, // objeto vacío porque es nuevo
        managers,
        allTeams,
        clients
        // selectedTeamIds
      });
    } catch (error) {
      console.error('Error en newView:', error.message);
      res.status(500).render('error500', { title: 'Error del servidor' });
    }
  };

  // Método createView para crear un nuevo proyecto
  createView = async (req, res) => {
    try {
      console.log('=== INICIO CREATE VIEW ===');
      console.log('req.body completo:', JSON.stringify(req.body, null, 2));

      const { name, description, project_manager, client_id, start_date, end_date, budget, billing_type, status } = req.body;

      console.log('Datos principales:', { name, project_manager, client_id, start_date, end_date, budget, billing_type, status });

      if (!name || !project_manager) {
        console.log('Falta nombre o project_manager');
        return res.status(400).send('Nombre y Project Manager son requeridos');
      }

      console.log('Project Manager recibido:', project_manager);
      const managerId = mongoose.Types.ObjectId.createFromHexString(project_manager);
      console.log('Project Manager ObjectId:', managerId);

      let clientObjectId = null;
      if (client_id) {
        if (mongoose.Types.ObjectId.isValid(client_id)) {
          clientObjectId = mongoose.Types.ObjectId.createFromHexString(client_id);
          console.log('Client ObjectId:', clientObjectId);
        } else {
          console.log('client_id no válido:', client_id);
        }
      }

      const teamsCount = parseInt(req.body.teams_count) || 0;
      console.log('teamsCount:', teamsCount);
      const teamsArray = [];

      for (let i = 0; i < teamsCount; i++) {
        const teamId = req.body[`team_${i}`];
        console.log(`team_${i}:`, teamId);

        if (teamId && mongoose.Types.ObjectId.isValid(teamId)) {
          teamsArray.push({ team_id: mongoose.Types.ObjectId.createFromHexString(teamId) });
        } else {
          console.log(`team_${i} inválido o undefined:`, teamId);
        }
      }

      console.log('Teams array final:', teamsArray);

      const createData = {
        name,
        description,
        project_manager: managerId,
        client_id: clientObjectId,
        start_date: start_date || null,
        end_date: end_date || null,
        budget: budget ? parseFloat(budget) : 0,
        billing_type: billing_type || 'fixed',
        status: status || 'pending',
        teams: teamsArray,
        code: new mongoose.Types.ObjectId().toString() // temporal
      };

      console.log('createData a crear:', JSON.stringify(createData, null, 2));

      const createdItem = await this.model.create(createData);
      console.log('Proyecto creado con _id:', createdItem._id);

      if (this.codePrefix) {
        const code = this.codeGenerator.generateCodeFromId(createdItem._id, this.codePrefix);
        console.log('Código generado:', code);
        await this.model.update(createdItem._id, { code });
      }

      res.redirect(`/projects/${createdItem._id}`);
    } catch (error) {
      console.error('Error al crear project:', error.message);
      console.error('Stack completo:', error.stack);
      res.status(500).send(`Error: ${error.message}`);
    }
  };

}

export default new ProjectController();