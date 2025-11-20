import Project from '../models/ProjectModel.js';
import Task from '../models/TaskModel.js';
import TimeEntry from '../models/TimeEntryModel.js';
import Client from '../models/ClientModel.js';

/**
 * ProjectReportController
 * Controlador para el dashboard de reportes de proyectos
 */
class ProjectReportController {
  
  /**
   * Renderizar la vista del reporte de proyectos
   */
  static async renderView(req, res, next) {
    try {
      res.render('project-report', {
        title: 'Reporte de Proyectos',
        user: req.user
      });
    } catch (error) {
      console.error('Error al renderizar reporte de proyectos:', error);
      next(error);
    }
  }

  /**
   * API: Obtener datos del reporte de proyectos
   */
  static async getReportData(req, res, next) {
    try {
      const filter = req.query.filter || 'all';

      // Obtener datos en paralelo
      const [
        summary,
        projectStatus,
        projectsByClient,
        billingTypes,
        timeline,
        topProfitable,
        activeProjects,
        completedProjects,
        alertProjects
      ] = await Promise.all([
        ProjectReportController.getSummary(filter),
        ProjectReportController.getProjectStatus(filter),
        ProjectReportController.getProjectsByClient(filter),
        ProjectReportController.getBillingTypes(filter),
        ProjectReportController.getTimeline(),
        ProjectReportController.getTopProfitable(filter),
        ProjectReportController.getActiveProjects(filter),
        ProjectReportController.getCompletedProjects(filter),
        ProjectReportController.getAlertProjects()
      ]);

      res.json({
        summary,
        charts: {
          projectStatus,
          projectsByClient,
          billingTypes,
          timeline,
          topProfitable
        },
        tables: {
          activeProjects,
          completedProjects,
          alertProjects
        }
      });

    } catch (error) {
      console.error('Error al obtener datos del reporte de proyectos:', error);
      next(error);
    }
  }

  /**
   * Construir query según el filtro
   */
  static buildFilterQuery(filter) {
    const now = new Date();
    let query = {};

    switch (filter) {
      case 'active':
        query.status = { $in: ['planning', 'in_progress'] };
        break;
      case 'completed':
        query.status = 'completed';
        break;
      case 'current':
        const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
        const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0);
        query.start_date = { $gte: monthStart, $lte: monthEnd };
        break;
      case 'quarter':
        const quarterMonth = Math.floor(now.getMonth() / 3) * 3;
        const quarterStart = new Date(now.getFullYear(), quarterMonth, 1);
        const quarterEnd = new Date(now.getFullYear(), quarterMonth + 3, 0);
        query.start_date = { $gte: quarterStart, $lte: quarterEnd };
        break;
      default:
        // 'all' - sin filtro adicional
        break;
    }

    return query;
  }

  /**
   * Obtener resumen de proyectos
   */
  static async getSummary(filter) {
    const query = ProjectReportController.buildFilterQuery(filter);
    
    const projects = await Project.model.find(query);
    
    const totalProjects = projects.length;
    const activeProjects = projects.filter(p => p.status === 'in_progress').length;
    const onHoldProjects = projects.filter(p => p.status === 'on_hold').length;
    const completedProjects = projects.filter(p => p.status === 'completed').length;
    const totalBudget = projects.reduce((sum, p) => sum + (p.budget || 0), 0);

    // Obtener horas totales de time entries (a través de las tareas)
    const projectIds = projects.map(p => p._id);
    
    // Primero obtener todas las tareas de estos proyectos
    const tasks = await Task.model.find({
      project_id: { $in: projectIds }
    });
    const taskIds = tasks.map(t => t._id);
    
    // Luego obtener los time entries de esas tareas
    const timeEntries = await TimeEntry.model.find({
      task_id: { $in: taskIds }
    });
    const totalHours = timeEntries.reduce((sum, te) => sum + (te.hours_worked || 0), 0);

    // Contar tareas (ya las obtuvimos arriba)
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(t => t.status === 'done').length;

    return {
      totalProjects,
      activeProjects,
      onHoldProjects,
      completedProjects,
      totalBudget,
      totalHours,
      totalTasks,
      completedTasks
    };
  }

  /**
   * Obtener distribución por estado
   */
  static async getProjectStatus(filter) {
    const query = ProjectReportController.buildFilterQuery(filter);
    const projects = await Project.model.find(query);

    const statusMap = new Map();
    const statusLabels = {
      planning: 'Planificación',
      in_progress: 'En Progreso',
      on_hold: 'En Pausa',
      completed: 'Completado',
      cancelled: 'Cancelado'
    };

    projects.forEach(proj => {
      const status = proj.status || 'planning';
      const count = statusMap.get(status) || 0;
      statusMap.set(status, count + 1);
    });

    return {
      labels: Array.from(statusMap.keys()).map(k => statusLabels[k] || k),
      data: Array.from(statusMap.values())
    };
  }

  /**
   * Obtener proyectos por cliente (Top 5)
   */
  static async getProjectsByClient(filter) {
    const query = ProjectReportController.buildFilterQuery(filter);
    const projects = await Project.model.find(query).populate('client_id');

    const clientMap = new Map();

    projects.forEach(proj => {
      if (proj.client_id) {
        const clientId = proj.client_id._id.toString();
        let clientName;
        if (proj.client_id.client_type === 'company') {
          clientName = proj.client_id.name || 'Sin nombre';
        } else {
          clientName = (proj.client_id.first_name || '') + ' ' + (proj.client_id.last_name || '').trim() || 'Sin nombre';
        }
        const count = clientMap.get(clientName) || 0;
        clientMap.set(clientName, count + 1);
      }
    });

    // Ordenar y tomar top 5
    const sorted = Array.from(clientMap.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);

    return {
      labels: sorted.map(item => item[0]),
      data: sorted.map(item => item[1])
    };
  }

  /**
   * Obtener distribución por tipo de facturación
   */
  static async getBillingTypes(filter) {
    const query = ProjectReportController.buildFilterQuery(filter);
    const projects = await Project.model.find(query);

    const billingMap = new Map();
    const billingLabels = {
      fixed: 'Precio Fijo',
      hourly: 'Por Hora',
      milestone: 'Por Hito',
      retainer: 'Retención'
    };

    projects.forEach(proj => {
      const type = proj.billing_type || 'fixed';
      const count = billingMap.get(type) || 0;
      billingMap.set(type, count + 1);
    });

    return {
      labels: Array.from(billingMap.keys()).map(k => billingLabels[k] || k),
      data: Array.from(billingMap.values())
    };
  }

  /**
   * Obtener timeline de inicio de proyectos (últimos 6 meses)
   */
  static async getTimeline() {
    const labels = [];
    const data = [];
    const now = new Date();

    for (let i = 5; i >= 0; i--) {
      const month = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthEnd = new Date(now.getFullYear(), now.getMonth() - i + 1, 0, 23, 59, 59);
      
      labels.push(month.toLocaleDateString('es-AR', { month: 'short', year: '2-digit' }));
      
      const count = await Project.model.countDocuments({
        start_date: { $gte: month, $lte: monthEnd }
      });
      
      data.push(count);
    }

    return { labels, data };
  }

  /**
   * Obtener top 5 proyectos más rentables
   */
  static async getTopProfitable(filter) {
    const query = ProjectReportController.buildFilterQuery(filter);
    const projects = await Project.model.find(query).populate('client_id');

    // Calcular rentabilidad estimada (presupuesto - costos estimados)
    const projectsWithProfit = await Promise.all(
      projects.map(async (proj) => {
        // Obtener tareas del proyecto
        const tasks = await Task.model.find({ project_id: proj._id });
        const taskIds = tasks.map(t => t._id);
        
        // Obtener time entries de esas tareas
        const timeEntries = await TimeEntry.model.find({ task_id: { $in: taskIds } });
        const totalHours = timeEntries.reduce((sum, te) => sum + (te.hours_worked || 0), 0);
        
        // Costo estimado: $50 por hora (puedes ajustar este valor)
        const estimatedCost = totalHours * 50;
        const profit = (proj.budget || 0) - estimatedCost;

        let clientName = 'Sin cliente';
        if (proj.client_id) {
          if (proj.client_id.client_type === 'company') {
            clientName = proj.client_id.name || 'Sin nombre';
          } else {
            clientName = (proj.client_id.first_name || '') + ' ' + (proj.client_id.last_name || '').trim() || 'Sin nombre';
          }
        }

        return {
          name: proj.name,
          client: clientName,
          profit: profit
        };
      })
    );

    // Ordenar por rentabilidad y tomar top 5
    return projectsWithProfit
      .sort((a, b) => b.profit - a.profit)
      .slice(0, 5);
  }

  /**
   * Obtener proyectos activos
   */
  static async getActiveProjects(filter) {
    let query = { status: { $in: ['planning', 'in_progress'] } };
    
    if (filter !== 'all' && filter !== 'active') {
      query = { ...query, ...ProjectReportController.buildFilterQuery(filter) };
    }

    const projects = await Project.model.find(query)
      .populate('client_id')
      .limit(10)
      .sort({ start_date: -1 });

    return projects.map(proj => {
      let clientName = 'Sin cliente';
      if (proj.client_id) {
        if (proj.client_id.client_type === 'company') {
          clientName = proj.client_id.name || 'Sin nombre';
        } else {
          clientName = (proj.client_id.first_name || '') + ' ' + (proj.client_id.last_name || '').trim() || 'Sin nombre';
        }
      }

      return {
        code: proj.code,
        name: proj.name,
        client: clientName,
        budget: proj.budget || 0,
        status: proj.status
      };
    });
  }

  /**
   * Obtener proyectos completados recientemente
   */
  static async getCompletedProjects(filter) {
    let query = { status: 'completed' };
    
    if (filter !== 'all' && filter !== 'completed') {
      query = { ...query, ...ProjectReportController.buildFilterQuery(filter) };
    }

    const projects = await Project.model.find(query)
      .populate('client_id')
      .limit(10)
      .sort({ end_date: -1 });

    return projects.map(proj => {
      let clientName = 'Sin cliente';
      if (proj.client_id) {
        if (proj.client_id.client_type === 'company') {
          clientName = proj.client_id.name || 'Sin nombre';
        } else {
          clientName = (proj.client_id.first_name || '') + ' ' + (proj.client_id.last_name || '').trim() || 'Sin nombre';
        }
      }

      // Calcular duración
      const duration = proj.start_date && proj.end_date
        ? Math.ceil((new Date(proj.end_date) - new Date(proj.start_date)) / (1000 * 60 * 60 * 24))
        : 0;

      return {
        code: proj.code,
        name: proj.name,
        client: clientName,
        duration
      };
    });
  }

  /**
   * Obtener proyectos que requieren atención
   */
  static async getAlertProjects() {
    const now = new Date();
    const projects = await Project.model.find({
      status: { $in: ['planning', 'in_progress'] }
    }).populate('client_id');

    const alerts = [];

    for (const proj of projects) {
      let alert = null;
      let clientName = 'Sin cliente';
      
      if (proj.client_id) {
        if (proj.client_id.client_type === 'company') {
          clientName = proj.client_id.name || 'Sin nombre';
        } else {
          clientName = (proj.client_id.first_name || '') + ' ' + (proj.client_id.last_name || '').trim() || 'Sin nombre';
        }
      }

      const daysElapsed = proj.start_date
        ? Math.ceil((now - new Date(proj.start_date)) / (1000 * 60 * 60 * 24))
        : 0;

      // Verificar si está cerca de la fecha límite
      if (proj.end_date) {
        const daysRemaining = Math.ceil((new Date(proj.end_date) - now) / (1000 * 60 * 60 * 24));
        if (daysRemaining < 7 && daysRemaining > 0) {
          alert = `Vence en ${daysRemaining} días`;
        } else if (daysRemaining < 0) {
          alert = `Atrasado ${Math.abs(daysRemaining)} días`;
        }
      }

      // Verificar si lleva mucho tiempo en planificación
      if (proj.status === 'planning' && daysElapsed > 30) {
        alert = alert || 'Más de 30 días en planificación';
      }

      if (alert) {
        alerts.push({
          id: proj._id,
          name: proj.name,
          client: clientName,
          alert,
          budget: proj.budget || 0,
          daysElapsed
        });
      }
    }

    return alerts;
  }
}

export default ProjectReportController;
