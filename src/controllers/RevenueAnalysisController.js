import Invoice from '../models/InvoiceModel.js';
import Project from '../models/ProjectModel.js';
import Client from '../models/ClientModel.js';
import Estimate from '../models/EstimateModel.js';

/**
 * RevenueAnalysisController
 * Controlador para el análisis detallado de ingresos
 */
class RevenueAnalysisController {
  
  /**
   * Renderizar la vista del análisis de ingresos
   */
  static async renderView(req, res, next) {
    try {
      res.render('revenue-analysis', {
        title: 'Análisis de Ingresos',
        user: req.user
      });
    } catch (error) {
      console.error('Error al renderizar análisis de ingresos:', error);
      next(error);
    }
  }

  /**
   * API: Obtener datos del análisis de ingresos
   */
  static async getAnalysisData(req, res, next) {
    try {
      const period = req.query.period || 'year';
      const { startDate, endDate, prevStartDate, prevEndDate } = RevenueAnalysisController.getDateRange(period);

      // Obtener datos en paralelo
      const [
        summary,
        evolution,
        bySource,
        byClient,
        yearOverYear,
        quarterly,
        recurring,
        billingType,
        monthlyDetail
      ] = await Promise.all([
        RevenueAnalysisController.getSummary(startDate, endDate, prevStartDate, prevEndDate),
        RevenueAnalysisController.getEvolution(startDate, endDate),
        RevenueAnalysisController.getBySource(startDate, endDate),
        RevenueAnalysisController.getByClient(startDate, endDate),
        RevenueAnalysisController.getYearOverYear(),
        RevenueAnalysisController.getQuarterly(startDate, endDate),
        RevenueAnalysisController.getRecurring(startDate, endDate),
        RevenueAnalysisController.getByBillingType(startDate, endDate),
        RevenueAnalysisController.getMonthlyDetail(startDate, endDate)
      ]);

      res.json({
        summary,
        charts: {
          evolution,
          bySource,
          byClient,
          yearOverYear,
          quarterly,
          recurring,
          billingType
        },
        monthlyDetail
      });

    } catch (error) {
      console.error('Error al obtener análisis de ingresos:', error);
      next(error);
    }
  }

  /**
   * Calcular rangos de fechas
   */
  static getDateRange(period) {
    const now = new Date();
    let startDate, endDate, prevStartDate, prevEndDate;

    switch (period) {
      case 'quarter':
        const quarterMonth = Math.floor(now.getMonth() / 3) * 3;
        startDate = new Date(now.getFullYear(), quarterMonth, 1);
        endDate = new Date(now.getFullYear(), quarterMonth + 3, 0, 23, 59, 59);
        prevStartDate = new Date(now.getFullYear(), quarterMonth - 3, 1);
        prevEndDate = new Date(now.getFullYear(), quarterMonth, 0, 23, 59, 59);
        break;

      case 'semester':
        const semesterMonth = now.getMonth() < 6 ? 0 : 6;
        startDate = new Date(now.getFullYear(), semesterMonth, 1);
        endDate = new Date(now.getFullYear(), semesterMonth + 6, 0, 23, 59, 59);
        prevStartDate = new Date(now.getFullYear(), semesterMonth - 6, 1);
        prevEndDate = new Date(now.getFullYear(), semesterMonth, 0, 23, 59, 59);
        break;

      default: // 'year'
        startDate = new Date(now.getFullYear(), 0, 1);
        endDate = new Date(now.getFullYear(), 11, 31, 23, 59, 59);
        prevStartDate = new Date(now.getFullYear() - 1, 0, 1);
        prevEndDate = new Date(now.getFullYear() - 1, 11, 31, 23, 59, 59);
    }

    return { startDate, endDate, prevStartDate, prevEndDate };
  }

  /**
   * Obtener resumen de ingresos
   */
  static async getSummary(startDate, endDate, prevStartDate, prevEndDate) {
    // Ingresos del período actual
    const currentInvoices = await Invoice.model.find({
      status: 'paid',
      issue_date: { $gte: startDate, $lte: endDate }
    });
    const totalRevenue = currentInvoices.reduce((sum, inv) => sum + inv.total_amount, 0);

    // Ingresos del período anterior
    const prevInvoices = await Invoice.model.find({
      status: 'paid',
      issue_date: { $gte: prevStartDate, $lte: prevEndDate }
    });
    const prevRevenue = prevInvoices.reduce((sum, inv) => sum + inv.total_amount, 0);

    // Crecimiento
    const revenueGrowth = prevRevenue > 0 ? ((totalRevenue - prevRevenue) / prevRevenue) * 100 : 0;

    // Promedio mensual
    const monthsDiff = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24 * 30));
    const avgMonthlyRevenue = monthsDiff > 0 ? totalRevenue / monthsDiff : totalRevenue;

    // Proyección anual
    const projectedAnnualRevenue = avgMonthlyRevenue * 12;

    // Tasa de crecimiento promedio mensual
    const growthRate = monthsDiff > 1 ? (Math.pow(totalRevenue / (prevRevenue || 1), 1 / monthsDiff) - 1) * 100 : 0;

    // Concentración de ingresos (top clientes)
    const invoicesByClient = await Invoice.model.find({
      status: 'paid',
      issue_date: { $gte: startDate, $lte: endDate }
    }).populate({
      path: 'estimate_id',
      populate: {
        path: 'project_id',
        populate: 'client_id'
      }
    });

    const clientRevenueMap = new Map();
    invoicesByClient.forEach(inv => {
      const client = inv.estimate_id?.project_id?.client_id;
      if (client) {
        const clientId = client._id.toString();
        const current = clientRevenueMap.get(clientId) || 0;
        clientRevenueMap.set(clientId, current + inv.total_amount);
      }
    });

    const sortedClients = Array.from(clientRevenueMap.values()).sort((a, b) => b - a);
    const top3Revenue = sortedClients.slice(0, 3).reduce((sum, val) => sum + val, 0);
    const top5Revenue = sortedClients.slice(0, 5).reduce((sum, val) => sum + val, 0);
    const top3Concentration = totalRevenue > 0 ? (top3Revenue / totalRevenue) * 100 : 0;
    const top5Concentration = totalRevenue > 0 ? (top5Revenue / totalRevenue) * 100 : 0;

    return {
      totalRevenue,
      avgMonthlyRevenue,
      projectedAnnualRevenue,
      revenueGrowth,
      growthRate,
      top3Concentration,
      top5Concentration
    };
  }

  /**
   * Obtener evolución mensual con tendencia
   */
  static async getEvolution(startDate, endDate) {
    const labels = [];
    const data = [];
    
    const monthsDiff = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24 * 30));
    const startMonth = new Date(startDate);

    for (let i = 0; i < monthsDiff; i++) {
      const month = new Date(startMonth.getFullYear(), startMonth.getMonth() + i, 1);
      const monthEnd = new Date(startMonth.getFullYear(), startMonth.getMonth() + i + 1, 0, 23, 59, 59);
      
      labels.push(month.toLocaleDateString('es-AR', { month: 'short', year: '2-digit' }));
      
      const invoices = await Invoice.model.find({
        status: 'paid',
        issue_date: { $gte: month, $lte: monthEnd }
      });
      
      const revenue = invoices.reduce((sum, inv) => sum + inv.total_amount, 0);
      data.push(revenue);
    }

    // Calcular línea de tendencia (regresión lineal simple)
    const trend = RevenueAnalysisController.calculateTrend(data);

    return { labels, data, trend };
  }

  /**
   * Calcular línea de tendencia
   */
  static calculateTrend(data) {
    const n = data.length;
    if (n === 0) return [];

    let sumX = 0, sumY = 0, sumXY = 0, sumXX = 0;
    
    for (let i = 0; i < n; i++) {
      sumX += i;
      sumY += data[i];
      sumXY += i * data[i];
      sumXX += i * i;
    }

    const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
    const intercept = (sumY - slope * sumX) / n;

    return data.map((_, i) => slope * i + intercept);
  }

  /**
   * Obtener ingresos por fuente (tipo de proyecto)
   */
  static async getBySource(startDate, endDate) {
    const invoices = await Invoice.model.find({
      status: 'paid',
      issue_date: { $gte: startDate, $lte: endDate }
    }).populate({
      path: 'estimate_id',
      populate: 'project_id'
    });

    const sourceMap = new Map([
      ['Servicios', 0],
      ['Productos', 0],
      ['Consultoría', 0],
      ['Mantenimiento', 0],
      ['Otros', 0]
    ]);

    invoices.forEach(inv => {
      const projectName = inv.estimate_id?.project_id?.name || '';
      let source = 'Otros';
      
      if (projectName.toLowerCase().includes('servicio')) source = 'Servicios';
      else if (projectName.toLowerCase().includes('producto')) source = 'Productos';
      else if (projectName.toLowerCase().includes('consultoría') || projectName.toLowerCase().includes('consultoria')) source = 'Consultoría';
      else if (projectName.toLowerCase().includes('mantenimiento')) source = 'Mantenimiento';

      sourceMap.set(source, sourceMap.get(source) + inv.total_amount);
    });

    return {
      labels: Array.from(sourceMap.keys()).filter(k => sourceMap.get(k) > 0),
      data: Array.from(sourceMap.values()).filter(v => v > 0)
    };
  }

  /**
   * Obtener top 10 clientes por ingresos
   */
  static async getByClient(startDate, endDate) {
    const invoices = await Invoice.model.find({
      status: 'paid',
      issue_date: { $gte: startDate, $lte: endDate }
    }).populate({
      path: 'estimate_id',
      populate: {
        path: 'project_id',
        populate: 'client_id'
      }
    });

    const clientMap = new Map();

    invoices.forEach(inv => {
      const client = inv.estimate_id?.project_id?.client_id;
      if (client) {
        const clientId = client._id.toString();
        let clientName;
        if (client.client_type === 'company') {
          clientName = client.name || 'Sin nombre';
        } else {
          clientName = (client.first_name || '') + ' ' + (client.last_name || '').trim() || 'Sin nombre';
        }
        const current = clientMap.get(clientId) || { name: clientName, revenue: 0 };
        current.revenue += inv.total_amount;
        clientMap.set(clientId, current);
      }
    });

    const sorted = Array.from(clientMap.values())
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 10);

    return {
      labels: sorted.map(c => c.name),
      data: sorted.map(c => c.revenue)
    };
  }

  /**
   * Comparación año a año
   */
  static async getYearOverYear() {
    const currentYear = new Date().getFullYear();
    const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
    
    const currentYearData = [];
    const previousYearData = [];

    for (let month = 0; month < 12; month++) {
      // Año actual
      const currentStart = new Date(currentYear, month, 1);
      const currentEnd = new Date(currentYear, month + 1, 0, 23, 59, 59);
      const currentInvoices = await Invoice.model.find({
        status: 'paid',
        issue_date: { $gte: currentStart, $lte: currentEnd }
      });
      currentYearData.push(currentInvoices.reduce((sum, inv) => sum + inv.total_amount, 0));

      // Año anterior
      const prevStart = new Date(currentYear - 1, month, 1);
      const prevEnd = new Date(currentYear - 1, month + 1, 0, 23, 59, 59);
      const prevInvoices = await Invoice.model.find({
        status: 'paid',
        issue_date: { $gte: prevStart, $lte: prevEnd }
      });
      previousYearData.push(prevInvoices.reduce((sum, inv) => sum + inv.total_amount, 0));
    }

    return {
      labels: months,
      datasets: [
        {
          label: currentYear.toString(),
          data: currentYearData,
          backgroundColor: 'rgba(25, 135, 84, 0.7)'
        },
        {
          label: (currentYear - 1).toString(),
          data: previousYearData,
          backgroundColor: 'rgba(108, 117, 125, 0.5)'
        }
      ]
    };
  }

  /**
   * Distribución trimestral
   */
  static async getQuarterly(startDate, endDate) {
    const year = startDate.getFullYear();
    const quarters = ['Q1', 'Q2', 'Q3', 'Q4'];
    const data = [];

    for (let q = 0; q < 4; q++) {
      const qStart = new Date(year, q * 3, 1);
      const qEnd = new Date(year, (q + 1) * 3, 0, 23, 59, 59);
      
      const invoices = await Invoice.model.find({
        status: 'paid',
        issue_date: { $gte: qStart, $lte: qEnd }
      });
      
      data.push(invoices.reduce((sum, inv) => sum + inv.total_amount, 0));
    }

    return { labels: quarters, data };
  }

  /**
   * Ingresos recurrentes vs no recurrentes
   */
  static async getRecurring(startDate, endDate) {
    const projects = await Project.model.find().populate('client_id');
    const invoices = await Invoice.model.find({
      status: 'paid',
      issue_date: { $gte: startDate, $lte: endDate }
    }).populate({
      path: 'estimate_id',
      populate: 'project_id'
    });

    let recurring = 0;
    let nonRecurring = 0;

    // Determinar si un cliente tiene más de 3 proyectos (considerar recurrente)
    const clientProjects = new Map();
    projects.forEach(proj => {
      if (proj.client_id) {
        const clientId = proj.client_id._id.toString();
        const count = clientProjects.get(clientId) || 0;
        clientProjects.set(clientId, count + 1);
      }
    });

    invoices.forEach(inv => {
      const client = inv.estimate_id?.project_id?.client_id;
      if (client) {
        const clientId = client._id.toString();
        const projectCount = clientProjects.get(clientId) || 0;
        
        if (projectCount >= 3) {
          recurring += inv.total_amount;
        } else {
          nonRecurring += inv.total_amount;
        }
      } else {
        nonRecurring += inv.total_amount;
      }
    });

    return { data: [recurring, nonRecurring] };
  }

  /**
   * Ingresos por tipo de facturación
   */
  static async getByBillingType(startDate, endDate) {
    const invoices = await Invoice.model.find({
      status: 'paid',
      issue_date: { $gte: startDate, $lte: endDate }
    }).populate({
      path: 'estimate_id',
      populate: 'project_id'
    });

    const billingMap = new Map();
    const billingLabels = {
      fixed: 'Precio Fijo',
      hourly: 'Por Hora',
      milestone: 'Por Hito',
      retainer: 'Retención'
    };

    invoices.forEach(inv => {
      const billingType = inv.estimate_id?.project_id?.billing_type || 'fixed';
      const label = billingLabels[billingType] || billingType;
      const current = billingMap.get(label) || 0;
      billingMap.set(label, current + inv.total_amount);
    });

    return {
      labels: Array.from(billingMap.keys()),
      data: Array.from(billingMap.values())
    };
  }

  /**
   * Detalle mensual
   */
  static async getMonthlyDetail(startDate, endDate) {
    const monthsDiff = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24 * 30));
    const detail = [];
    let accumulated = 0;
    let previousRevenue = 0;

    for (let i = 0; i < monthsDiff; i++) {
      const month = new Date(startDate.getFullYear(), startDate.getMonth() + i, 1);
      const monthEnd = new Date(startDate.getFullYear(), startDate.getMonth() + i + 1, 0, 23, 59, 59);
      
      const invoices = await Invoice.model.find({
        status: 'paid',
        issue_date: { $gte: month, $lte: monthEnd }
      });
      
      const revenue = invoices.reduce((sum, inv) => sum + inv.total_amount, 0);
      accumulated += revenue;
      const growth = previousRevenue > 0 ? ((revenue - previousRevenue) / previousRevenue) * 100 : 0;

      detail.push({
        month: month.toLocaleDateString('es-AR', { month: 'long', year: 'numeric' }),
        invoices: invoices.length,
        revenue,
        growth,
        accumulated
      });

      previousRevenue = revenue;
    }

    return detail;
  }
}

export default RevenueAnalysisController;
