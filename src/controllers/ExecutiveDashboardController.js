import Invoice from '../models/InvoiceModel.js';
import Client from '../models/ClientModel.js';
import Project from '../models/ProjectModel.js';
import Task from '../models/TaskModel.js';
import PermissionAwareController from './PermissionAwareController.js';

class ExecutiveDashboardController extends PermissionAwareController {
  constructor() {
    super(null, null, 'dashboards/executive-dashboard');
  }

  /**
   * Vista del dashboard ejecutivo
   */
  getView = async (req, res) => {
    try {
      res.render('dashboards/executive-dashboard', {
        title: 'Dashboard Ejecutivo - NexusFlow'
      });
    } catch (error) {
      console.error('Error al cargar dashboard ejecutivo:', error);
      res.status(500).render('error500', { title: 'Error del servidor' });
    }
  };

  /**
   * API para obtener datos del dashboard
   */
  getData = async (req, res) => {
    try {
      const { period = 'current' } = req.query;
      
      // Calcular rango de fechas según el período
      const dateRange = this.getDateRange(period);
      
      // Obtener métricas principales
      const metrics = await this.getMainMetrics(dateRange);
      
      // Obtener análisis de proyectos
      const projectAnalysis = await this.getProjectAnalysis(dateRange);
      
      res.json({
        metrics,
        projectAnalysis
      });
      
    } catch (error) {
      console.error('Error al obtener datos del dashboard:', error);
      res.status(500).json({ error: 'Error al cargar datos del dashboard' });
    }
  };

  /**
   * Calcular rango de fechas según período
   */
  getDateRange(period) {
    const now = new Date();
    let startDate, endDate;
    
    switch (period) {
      case 'current':
        // Mes actual
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);
        break;
        
      case 'last':
        // Mes anterior
        startDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        endDate = new Date(now.getFullYear(), now.getMonth(), 0);
        break;
        
      case 'quarter':
        // Último trimestre
        startDate = new Date(now.getFullYear(), now.getMonth() - 3, 1);
        endDate = now;
        break;
        
      case 'year':
        // Año actual
        startDate = new Date(now.getFullYear(), 0, 1);
        endDate = now;
        break;
        
      default:
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        endDate = now;
    }
    
    return { startDate, endDate };
  }

  /**
   * Obtener métricas principales del dashboard ejecutivo
   */
  async getMainMetrics(dateRange) {
    const { startDate, endDate } = dateRange;
    
    // Facturas del período actual
    const invoices = await Invoice.model.find({
      issue_date: { $gte: startDate, $lte: endDate }
    });
    
    // Facturas del período anterior (para comparaciones)
    const previousPeriodDays = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));
    const prevStartDate = new Date(startDate);
    prevStartDate.setDate(prevStartDate.getDate() - previousPeriodDays);
    
    const previousInvoices = await Invoice.model.find({
      issue_date: { $gte: prevStartDate, $lt: startDate }
    });
    
    // 1. MARGEN DE RENTABILIDAD (Simplificado: Revenue - Expenses / Revenue)
    const totalRevenue = invoices.reduce((sum, inv) => sum + (inv.total_amount || 0), 0);
    const totalExpenses = invoices.reduce((sum, inv) => sum + ((inv.total_amount || 0) * 0.3), 0); // Estimamos 30% de costos
    const profitMargin = totalRevenue > 0 ? ((totalRevenue - totalExpenses) / totalRevenue) * 100 : 0;
    
    const previousRevenue = previousInvoices.reduce((sum, inv) => sum + (inv.total_amount || 0), 0);
    const previousExpenses = previousRevenue * 0.3;
    const previousProfitMargin = previousRevenue > 0 ? ((previousRevenue - previousExpenses) / previousRevenue) * 100 : 0;
    const profitMarginChange = profitMargin - previousProfitMargin;
    
    // 2. TASA DE UTILIZACIÓN (Basado en proyectos activos vs total)
    const allProjects = await Project.model.find({});
    const activeProjects = allProjects.filter(p => p.status === 'in_progress');
    const utilizationRate = allProjects.length > 0 ? (activeProjects.length / allProjects.length) * 100 : 0;
    
    // Para el cambio, usar una métrica simple
    const utilizationChange = -2.0; // Placeholder, en producción calcular con datos históricos
    
    // 3. DSO (Days Sales Outstanding) - Días promedio para cobrar
    const paidInvoices = invoices.filter(inv => inv.status === 'paid');
    let totalDaysToPayment = 0;
    let validInvoicesCount = 0;
    
    paidInvoices.forEach(inv => {
      const issueDate = new Date(inv.issue_date);
      const dueDate = inv.due_date ? new Date(inv.due_date) : new Date(issueDate.getTime() + (30 * 24 * 60 * 60 * 1000));
      const days = Math.ceil((dueDate - issueDate) / (1000 * 60 * 60 * 24));
      if (days >= 0) {
        totalDaysToPayment += days;
        validInvoicesCount++;
      }
    });
    
    const dso = validInvoicesCount > 0 ? Math.round(totalDaysToPayment / validInvoicesCount) : 30;
    
    // Facturas atrasadas (más de 30 días sin pagar desde la fecha de vencimiento)
    const now = new Date();
    const overdueInvoices = invoices.filter(inv => {
      if (inv.status !== 'paid' && inv.status !== 'cancelled') {
        const dueDate = inv.due_date ? new Date(inv.due_date) : new Date(new Date(inv.issue_date).getTime() + (30 * 24 * 60 * 60 * 1000));
        const daysOverdue = Math.ceil((now - dueDate) / (1000 * 60 * 60 * 24));
        return daysOverdue > 0;
      }
      return false;
    }).length;
    
    return {
      profitMargin: parseFloat(profitMargin.toFixed(1)),
      profitMarginChange: parseFloat(profitMarginChange.toFixed(1)),
      utilizationRate: parseFloat(utilizationRate.toFixed(1)),
      utilizationChange: parseFloat(utilizationChange.toFixed(1)),
      dso: dso,
      overdueInvoices: overdueInvoices
    };
  }

  /**
   * Análisis de desviación de proyectos
   */
  async getProjectAnalysis(dateRange) {
    const { startDate, endDate } = dateRange;
    
    // Obtener proyectos activos o completados recientemente
    const projects = await Project.model.find({
      $or: [
        { status: 'in_progress' },
        { status: 'completed', end_date: { $gte: startDate } }
      ]
    }).limit(10);
    
    const projectAnalysis = [];
    
    for (const project of projects) {
      // Budget del proyecto
      const budget = project.budget || 10000; // Valor por defecto si no hay budget
      
      // Para el "actual", vamos a simular basándonos en el progreso
      // En producción, esto vendría de la suma de gastos reales + horas trabajadas
      let actual = budget;
      
      // Si el proyecto está en progreso, simular un gasto basado en tiempo
      if (project.status === 'in_progress') {
        // Calcular días desde el inicio
        const projectStart = project.start_date ? new Date(project.start_date) : new Date();
        const today = new Date();
        const daysElapsed = Math.ceil((today - projectStart) / (1000 * 60 * 60 * 24));
        
        // Si tiene fecha de fin prevista, calcular % de progreso
        if (project.end_date) {
          const projectEnd = new Date(project.end_date);
          const totalDays = Math.ceil((projectEnd - projectStart) / (1000 * 60 * 60 * 24));
          const progressPercentage = totalDays > 0 ? Math.min((daysElapsed / totalDays) * 100, 100) : 50;
          
          // Simular gasto real con una variación aleatoria (-10% a +20%)
          const variationFactor = 0.9 + (Math.random() * 0.3); // 0.9 a 1.2
          actual = (budget * progressPercentage / 100) * variationFactor;
        } else {
          // Sin fecha de fin, asumir 50% de progreso
          actual = budget * 0.5 * (0.9 + Math.random() * 0.3);
        }
      } else if (project.status === 'completed') {
        // Proyecto completado, simular gasto final con variación
        actual = budget * (0.85 + Math.random() * 0.35); // 85% a 120% del presupuesto
      }
      
      projectAnalysis.push({
        name: project.name || `Proyecto ${project.code}`,
        budget: parseFloat(budget.toFixed(2)),
        actual: parseFloat(actual.toFixed(2)),
        deviation: budget > 0 ? parseFloat(((actual - budget) / budget * 100).toFixed(1)) : 0
      });
    }
    
    // Si no hay proyectos, crear datos de ejemplo
    if (projectAnalysis.length === 0) {
      projectAnalysis.push(
        { name: 'Proyecto Demo 1', budget: 15000, actual: 14200, deviation: -5.3 },
        { name: 'Proyecto Demo 2', budget: 22000, actual: 24500, deviation: 11.4 },
        { name: 'Proyecto Demo 3', budget: 18000, actual: 17100, deviation: -5.0 }
      );
    }
    
    return { projects: projectAnalysis };
  }
}

export default new ExecutiveDashboardController();
