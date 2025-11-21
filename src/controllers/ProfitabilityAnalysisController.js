import Project from '../models/ProjectModel.js';
import Task from '../models/TaskModel.js';
import TimeEntry from '../models/TimeEntryModel.js';
import Expense from '../models/ExpenseModel.js';
import Invoice from '../models/InvoiceModel.js';

/**
 * ProfitabilityAnalysisController
 * Controlador para el análisis detallado de rentabilidad
 */
class ProfitabilityAnalysisController {
  
  // Costo promedio por hora (puede ser configurable)
  static COST_PER_HOUR = 50;

  /**
   * Renderizar la vista del análisis de rentabilidad
   */
  static async renderView(req, res, next) {
    try {
      res.render('dashboards/profitability-analysis', {
        title: 'Análisis de Rentabilidad',
        user: req.user
      });
    } catch (error) {
      console.error('Error al renderizar análisis de rentabilidad:', error);
      next(error);
    }
  }

  /**
   * API: Obtener datos del análisis de rentabilidad
   */
  static async getAnalysisData(req, res, next) {
    try {
      const period = req.query.period || 'year';
      const { startDate, endDate } = ProfitabilityAnalysisController.getDateRange(period);

      // Obtener datos en paralelo
      const [
        summary,
        evolution,
        costDistribution,
        byClient,
        byBilling,
        budgetVsActual,
        topProfitable,
        lowProfitable,
        detail,
        health
      ] = await Promise.all([
        ProfitabilityAnalysisController.getSummary(startDate, endDate),
        ProfitabilityAnalysisController.getEvolution(),
        ProfitabilityAnalysisController.getCostDistribution(startDate, endDate),
        ProfitabilityAnalysisController.getProfitabilityByClient(startDate, endDate),
        ProfitabilityAnalysisController.getProfitabilityByBilling(startDate, endDate),
        ProfitabilityAnalysisController.getBudgetVsActual(startDate, endDate),
        ProfitabilityAnalysisController.getTopProfitable(startDate, endDate),
        ProfitabilityAnalysisController.getLowProfitable(startDate, endDate),
        ProfitabilityAnalysisController.getDetail(startDate, endDate),
        ProfitabilityAnalysisController.getHealthIndicators(startDate, endDate)
      ]);

      res.json({
        summary,
        charts: {
          evolution,
          costDistribution,
          byClient,
          byBilling,
          budgetVsActual
        },
        tables: {
          topProfitable,
          lowProfitable,
          detail
        },
        health
      });

    } catch (error) {
      console.error('Error al obtener análisis de rentabilidad:', error);
      next(error);
    }
  }

  /**
   * Calcular rangos de fechas
   */
  static getDateRange(period) {
    const now = new Date();
    let startDate, endDate;

    switch (period) {
      case 'quarter':
        const quarterMonth = Math.floor(now.getMonth() / 3) * 3;
        startDate = new Date(now.getFullYear(), quarterMonth, 1);
        endDate = new Date(now.getFullYear(), quarterMonth + 3, 0, 23, 59, 59);
        break;

      case 'semester':
        const semesterMonth = now.getMonth() < 6 ? 0 : 6;
        startDate = new Date(now.getFullYear(), semesterMonth, 1);
        endDate = new Date(now.getFullYear(), semesterMonth + 6, 0, 23, 59, 59);
        break;

      case 'all':
        startDate = new Date(2020, 0, 1); // Desde 2020
        endDate = new Date(now.getFullYear() + 1, 0, 0, 23, 59, 59);
        break;

      default: // 'year'
        startDate = new Date(now.getFullYear(), 0, 1);
        endDate = new Date(now.getFullYear(), 11, 31, 23, 59, 59);
    }

    return { startDate, endDate };
  }

  /**
   * Calcular costos de un proyecto
   */
  static async calculateProjectCosts(projectId) {
    // Obtener tareas del proyecto
    const tasks = await Task.model.find({ project_id: projectId });
    const taskIds = tasks.map(t => t._id);

    // Obtener time entries
    const timeEntries = await TimeEntry.model.find({ task_id: { $in: taskIds } });
    const totalHours = timeEntries.reduce((sum, te) => sum + (te.hours_worked || 0), 0);
    const laborCost = totalHours * ProfitabilityAnalysisController.COST_PER_HOUR;

    // Obtener gastos directos del proyecto
    const expenses = await Expense.model.find({ project_id: projectId });
    const expenseCost = expenses.reduce((sum, exp) => sum + exp.amount, 0);

    return {
      totalCost: laborCost + expenseCost,
      laborCost,
      expenseCost,
      totalHours
    };
  }

  /**
   * Obtener resumen de rentabilidad
   */
  static async getSummary(startDate, endDate) {
    const projects = await Project.model.find({
      start_date: { $gte: startDate, $lte: endDate }
    });

    let totalRevenue = 0;
    let totalCosts = 0;
    let totalHours = 0;
    let completedProjects = 0;

    for (const project of projects) {
      const costs = await ProfitabilityAnalysisController.calculateProjectCosts(project._id);
      totalCosts += costs.totalCost;
      totalHours += costs.totalHours;
      
      // Usar presupuesto como ingreso estimado
      totalRevenue += project.budget || 0;
      
      if (project.status === 'completed') {
        completedProjects++;
      }
    }

    const grossProfit = totalRevenue - totalCosts;
    const grossMargin = totalRevenue > 0 ? (grossProfit / totalRevenue) * 100 : 0;
    
    // Margen neto (estimado, restando gastos generales ~10%)
    const overhead = totalRevenue * 0.10;
    const netProfit = grossProfit - overhead;
    const netMargin = totalRevenue > 0 ? (netProfit / totalRevenue) * 100 : 0;
    
    // ROI promedio
    const avgROI = totalCosts > 0 ? (grossProfit / totalCosts) * 100 : 0;
    
    // Costo por hora
    const avgCostPerHour = totalHours > 0 ? totalCosts / totalHours : ProfitabilityAnalysisController.COST_PER_HOUR;

    return {
      grossMargin,
      netMargin,
      avgROI,
      avgCostPerHour,
      grossProfit,
      netProfit,
      totalHours,
      completedProjects
    };
  }

  /**
   * Obtener evolución mensual de rentabilidad
   */
  static async getEvolution() {
    const labels = [];
    const revenue = [];
    const costs = [];
    const margin = [];
    
    const now = new Date();
    const startMonth = new Date(now.getFullYear(), now.getMonth() - 11, 1);

    for (let i = 0; i < 12; i++) {
      const month = new Date(startMonth.getFullYear(), startMonth.getMonth() + i, 1);
      const monthEnd = new Date(startMonth.getFullYear(), startMonth.getMonth() + i + 1, 0, 23, 59, 59);
      
      labels.push(month.toLocaleDateString('es-AR', { month: 'short' }));
      
      // Proyectos del mes
      const projects = await Project.model.find({
        start_date: { $gte: month, $lte: monthEnd }
      });

      let monthRevenue = 0;
      let monthCosts = 0;

      for (const project of projects) {
        const projectCosts = await ProfitabilityAnalysisController.calculateProjectCosts(project._id);
        monthRevenue += project.budget || 0;
        monthCosts += projectCosts.totalCost;
      }

      revenue.push(monthRevenue);
      costs.push(monthCosts);
      
      const monthMargin = monthRevenue > 0 ? ((monthRevenue - monthCosts) / monthRevenue) * 100 : 0;
      margin.push(monthMargin);
    }

    return { labels, revenue, costs, margin };
  }

  /**
   * Distribución de costos
   */
  static async getCostDistribution(startDate, endDate) {
    const projects = await Project.model.find({
      start_date: { $gte: startDate, $lte: endDate }
    });

    let totalLabor = 0;
    let totalExpenses = 0;
    let totalOverhead = 0;

    for (const project of projects) {
      const costs = await ProfitabilityAnalysisController.calculateProjectCosts(project._id);
      totalLabor += costs.laborCost;
      totalExpenses += costs.expenseCost;
    }

    // Overhead estimado (10% del total)
    totalOverhead = (totalLabor + totalExpenses) * 0.10;

    return {
      labels: ['Mano de Obra', 'Gastos Directos', 'Gastos Generales', 'Otros'],
      data: [totalLabor, totalExpenses, totalOverhead, totalExpenses * 0.05]
    };
  }

  /**
   * Rentabilidad por cliente
   */
  static async getProfitabilityByClient(startDate, endDate) {
    const projects = await Project.model.find({
      start_date: { $gte: startDate, $lte: endDate }
    }).populate('client_id');

    const clientMap = new Map();

    for (const project of projects) {
      if (project.client_id) {
        const clientId = project.client_id._id.toString();
        let clientName;
        if (project.client_id.client_type === 'company') {
          clientName = project.client_id.name || 'Sin nombre';
        } else {
          clientName = (project.client_id.first_name || '') + ' ' + (project.client_id.last_name || '').trim();
        }

        const costs = await ProfitabilityAnalysisController.calculateProjectCosts(project._id);
        const projectRevenue = project.budget || 0;
        const projectProfit = projectRevenue - costs.totalCost;
        const projectMargin = projectRevenue > 0 ? (projectProfit / projectRevenue) * 100 : 0;

        const current = clientMap.get(clientId) || { 
          name: clientName, 
          totalRevenue: 0, 
          totalCosts: 0,
          projects: 0 
        };
        
        current.totalRevenue += projectRevenue;
        current.totalCosts += costs.totalCost;
        current.projects += 1;
        clientMap.set(clientId, current);
      }
    }

    const sorted = Array.from(clientMap.values())
      .map(client => ({
        name: client.name,
        margin: client.totalRevenue > 0 ? ((client.totalRevenue - client.totalCosts) / client.totalRevenue) * 100 : 0
      }))
      .sort((a, b) => b.margin - a.margin)
      .slice(0, 10);

    return {
      labels: sorted.map(c => c.name),
      data: sorted.map(c => c.margin)
    };
  }

  /**
   * Rentabilidad por tipo de facturación
   */
  static async getProfitabilityByBilling(startDate, endDate) {
    const projects = await Project.model.find({
      start_date: { $gte: startDate, $lte: endDate }
    });

    const billingMap = new Map();
    const billingLabels = {
      fixed: 'Precio Fijo',
      hourly: 'Por Hora',
      milestone: 'Por Hito',
      retainer: 'Retención'
    };

    for (const project of projects) {
      const billingType = project.billing_type || 'fixed';
      const label = billingLabels[billingType] || billingType;

      const costs = await ProfitabilityAnalysisController.calculateProjectCosts(project._id);
      const revenue = project.budget || 0;
      const margin = revenue > 0 ? ((revenue - costs.totalCost) / revenue) * 100 : 0;

      const current = billingMap.get(label) || { totalMargin: 0, count: 0 };
      current.totalMargin += margin;
      current.count += 1;
      billingMap.set(label, current);
    }

    return {
      labels: Array.from(billingMap.keys()),
      data: Array.from(billingMap.values()).map(v => v.count > 0 ? v.totalMargin / v.count : 0)
    };
  }

  /**
   * Presupuesto vs Real
   */
  static async getBudgetVsActual(startDate, endDate) {
    const projects = await Project.model.find({
      start_date: { $gte: startDate, $lte: endDate }
    }).sort({ start_date: -1 }).limit(10);

    const labels = [];
    const budget = [];
    const actual = [];

    for (const project of projects) {
      labels.push(project.code || project.name.substring(0, 15));
      budget.push(project.budget || 0);
      
      const costs = await ProfitabilityAnalysisController.calculateProjectCosts(project._id);
      actual.push(costs.totalCost);
    }

    return { labels, budget, actual };
  }

  /**
   * Top 5 proyectos más rentables
   */
  static async getTopProfitable(startDate, endDate) {
    const projects = await Project.model.find({
      start_date: { $gte: startDate, $lte: endDate }
    }).populate('client_id');

    const projectsWithMargin = [];

    for (const project of projects) {
      const costs = await ProfitabilityAnalysisController.calculateProjectCosts(project._id);
      const revenue = project.budget || 0;
      const profit = revenue - costs.totalCost;
      const margin = revenue > 0 ? (profit / revenue) * 100 : 0;

      let clientName = 'Sin cliente';
      if (project.client_id) {
        if (project.client_id.client_type === 'company') {
          clientName = project.client_id.name || 'Sin nombre';
        } else {
          clientName = (project.client_id.first_name || '') + ' ' + (project.client_id.last_name || '').trim();
        }
      }

      projectsWithMargin.push({
        name: project.name,
        client: clientName,
        margin,
        profit
      });
    }

    return projectsWithMargin
      .sort((a, b) => b.margin - a.margin)
      .slice(0, 5);
  }

  /**
   * Top 5 proyectos menos rentables
   */
  static async getLowProfitable(startDate, endDate) {
    const projects = await Project.model.find({
      start_date: { $gte: startDate, $lte: endDate }
    }).populate('client_id');

    const projectsWithMargin = [];

    for (const project of projects) {
      const costs = await ProfitabilityAnalysisController.calculateProjectCosts(project._id);
      const revenue = project.budget || 0;
      const profit = revenue - costs.totalCost;
      const margin = revenue > 0 ? (profit / revenue) * 100 : -100;

      let clientName = 'Sin cliente';
      if (project.client_id) {
        if (project.client_id.client_type === 'company') {
          clientName = project.client_id.name || 'Sin nombre';
        } else {
          clientName = (project.client_id.first_name || '') + ' ' + (project.client_id.last_name || '').trim();
        }
      }

      projectsWithMargin.push({
        name: project.name,
        client: clientName,
        margin,
        profit
      });
    }

    return projectsWithMargin
      .sort((a, b) => a.margin - b.margin)
      .slice(0, 5);
  }

  /**
   * Detalle completo de proyectos
   */
  static async getDetail(startDate, endDate) {
    const projects = await Project.model.find({
      start_date: { $gte: startDate, $lte: endDate }
    }).populate('client_id').sort({ start_date: -1 });

    const detail = [];

    for (const project of projects) {
      const costs = await ProfitabilityAnalysisController.calculateProjectCosts(project._id);
      const budget = project.budget || 0;
      const profit = budget - costs.totalCost;
      const margin = budget > 0 ? (profit / budget) * 100 : 0;

      let clientName = 'Sin cliente';
      if (project.client_id) {
        if (project.client_id.client_type === 'company') {
          clientName = project.client_id.name || 'Sin nombre';
        } else {
          clientName = (project.client_id.first_name || '') + ' ' + (project.client_id.last_name || '').trim();
        }
      }

      detail.push({
        name: project.name,
        client: clientName,
        budget,
        costs: costs.totalCost,
        profit,
        margin,
        status: project.status
      });
    }

    return detail;
  }

  /**
   * Indicadores de salud financiera
   */
  static async getHealthIndicators(startDate, endDate) {
    const projects = await Project.model.find({
      start_date: { $gte: startDate, $lte: endDate }
    });

    let profitableCount = 0;
    let highMarginCount = 0;
    let lossCount = 0;
    const total = projects.length;

    for (const project of projects) {
      const costs = await ProfitabilityAnalysisController.calculateProjectCosts(project._id);
      const revenue = project.budget || 0;
      const profit = revenue - costs.totalCost;
      const margin = revenue > 0 ? (profit / revenue) * 100 : -100;

      if (profit > 0) profitableCount++;
      if (margin >= 20) highMarginCount++;
      if (profit < 0) lossCount++;
    }

    return {
      profitablePercentage: total > 0 ? (profitableCount / total) * 100 : 0,
      highMarginPercentage: total > 0 ? (highMarginCount / total) * 100 : 0,
      lossPercentage: total > 0 ? (lossCount / total) * 100 : 0
    };
  }
}

export default ProfitabilityAnalysisController;
