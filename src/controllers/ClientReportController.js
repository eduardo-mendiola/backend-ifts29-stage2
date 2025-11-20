import Client from '../models/ClientModel.js';
import Project from '../models/ProjectModel.js';
import Invoice from '../models/InvoiceModel.js';
import Contact from '../models/ContactModel.js';

class ClientReportController {
  
  // GET /reports/clients - Vista principal
  static async index(req, res) {
    try {
      res.render('client-report', {
        title: 'Reporte de Clientes',
        user: req.user
      });
    } catch (error) {
      console.error('Error al cargar reporte de clientes:', error);
      res.status(500).render('error500', { 
        error: 'Error al cargar el reporte de clientes',
        user: req.user 
      });
    }
  }

  // GET /api/client-report - API con datos
  static async getData(req, res) {
    try {
      const { filter = 'all' } = req.query;
      const today = new Date();
      
      // Obtener todos los clientes con sus relaciones
      const clients = await Client.model.find({})
        .sort({ created_at: -1 })
        .lean();

      // Obtener todos los proyectos
      const projects = await Project.model.find({})
        .populate('client_id')
        .lean();

      // Obtener todas las facturas con populate anidado
      const invoices = await Invoice.model.find({})
        .populate({
          path: 'estimate_id',
          populate: {
            path: 'project_id',
            populate: { path: 'client_id' }
          }
        })
        .lean();

      // Obtener todos los contactos
      const contacts = await Contact.model.find({})
        .lean();

      // Aplicar filtros
      let filteredClients = clients;
      
      if (filter === 'active') {
        const activeClientIds = new Set(
          projects
            .filter(p => p.status !== 'completed' && p.status !== 'cancelled')
            .map(p => p.client_id?._id?.toString())
        );
        filteredClients = clients.filter(c => activeClientIds.has(c._id.toString()));
      } else if (filter === 'year') {
        const yearStart = new Date(today.getFullYear(), 0, 1);
        filteredClients = clients.filter(c => new Date(c.created_at) >= yearStart);
      } else if (filter === 'quarter') {
        const quarterStart = new Date(today);
        quarterStart.setMonth(today.getMonth() - 3);
        filteredClients = clients.filter(c => new Date(c.created_at) >= quarterStart);
      }

      // Construir datos para respuesta
      const summary = ClientReportController.calculateSummary(filteredClients, clients, projects, invoices);
      const charts = ClientReportController.buildCharts(filteredClients, clients, projects, invoices);
      const tables = ClientReportController.buildTables(filteredClients, projects, invoices);
      const metrics = ClientReportController.calculateMetrics(filteredClients, contacts, projects, invoices);

      res.json({
        summary,
        charts,
        tables,
        metrics
      });

    } catch (error) {
      console.error('Error en getData de ClientReport:', error);
      res.status(500).json({ error: 'Error al obtener datos del reporte' });
    }
  }

  // Calcular resumen
  static calculateSummary(filteredClients, allClients, projects, invoices) {
    const today = new Date();
    const lastMonth = new Date(today);
    lastMonth.setMonth(today.getMonth() - 1);

    // Total de clientes
    const totalClients = filteredClients.length;

    // Clientes activos/inactivos
    const activeClientIds = new Set(
      projects
        .filter(p => p.status !== 'completed' && p.status !== 'cancelled')
        .map(p => p.client_id?._id?.toString())
    );
    const activeClients = filteredClients.filter(c => activeClientIds.has(c._id.toString())).length;
    const inactiveClients = totalClients - activeClients;

    // Facturación total
    const clientIds = new Set(filteredClients.map(c => c._id.toString()));
    const totalRevenue = invoices
      .filter(inv => {
        const clientId = inv.estimate_id?.project_id?.client_id?._id?.toString();
        return clientId && clientIds.has(clientId);
      })
      .reduce((sum, inv) => sum + (inv.total_amount || 0), 0);

    // Valor promedio por cliente
    const avgClientValue = totalClients > 0 ? totalRevenue / totalClients : 0;

    // Clientes nuevos
    const newClients = filteredClients.filter(c => {
      const created = new Date(c.created_at);
      return created >= lastMonth;
    }).length;

    // Clientes del mes anterior para crecimiento
    const twoMonthsAgo = new Date(today);
    twoMonthsAgo.setMonth(today.getMonth() - 2);
    const previousMonthClients = allClients.filter(c => {
      const created = new Date(c.created_at);
      return created >= twoMonthsAgo && created < lastMonth;
    }).length;

    const newClientsGrowth = previousMonthClients > 0 
      ? ((newClients - previousMonthClients) / previousMonthClients) * 100 
      : 0;

    // Clientes recurrentes (con más de 1 proyecto)
    const projectsByClient = {};
    projects.forEach(p => {
      const clientId = p.client_id?._id?.toString();
      if (clientId) {
        projectsByClient[clientId] = (projectsByClient[clientId] || 0) + 1;
      }
    });

    const recurringClients = filteredClients.filter(c => 
      (projectsByClient[c._id.toString()] || 0) > 1
    ).length;

    // Tasa de retención
    const retentionRate = totalClients > 0 
      ? (recurringClients / totalClients) * 100 
      : 0;

    return {
      totalClients,
      activeClients,
      inactiveClients,
      totalRevenue,
      avgClientValue,
      newClients,
      newClientsGrowth,
      recurringClients,
      retentionRate
    };
  }

  // Construir datos para gráficos
  static buildCharts(filteredClients, allClients, projects, invoices) {
    // Top 10 clientes por facturación
    const revenueByClient = {};
    const clientNames = {};

    invoices.forEach(inv => {
      const client = inv.estimate_id?.project_id?.client_id;
      if (client) {
        const clientId = client._id.toString();
        revenueByClient[clientId] = (revenueByClient[clientId] || 0) + (inv.total_amount || 0);
        
        // Obtener nombre del cliente
        if (!clientNames[clientId]) {
          clientNames[clientId] = client.client_type === 'company'
            ? client.name
            : `${client.first_name} ${client.last_name}`;
        }
      }
    });

    const topByRevenue = Object.entries(revenueByClient)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([clientId, revenue]) => ({
        label: clientNames[clientId] || 'Sin nombre',
        value: revenue
      }));

    // Distribución por tipo
    const companies = filteredClients.filter(c => c.client_type === 'company').length;
    const persons = filteredClients.filter(c => c.client_type === 'person').length;

    // Clientes por cantidad de proyectos
    const projectsByClient = {};
    projects.forEach(p => {
      const clientId = p.client_id?._id?.toString();
      if (clientId) {
        projectsByClient[clientId] = (projectsByClient[clientId] || 0) + 1;
      }
    });

    const projectDistribution = {
      '1 proyecto': 0,
      '2-3 proyectos': 0,
      '4-5 proyectos': 0,
      '6+ proyectos': 0
    };

    filteredClients.forEach(c => {
      const count = projectsByClient[c._id.toString()] || 0;
      if (count === 1) projectDistribution['1 proyecto']++;
      else if (count >= 2 && count <= 3) projectDistribution['2-3 proyectos']++;
      else if (count >= 4 && count <= 5) projectDistribution['4-5 proyectos']++;
      else if (count >= 6) projectDistribution['6+ proyectos']++;
    });

    // Evolución de nuevos clientes (últimos 12 meses)
    const today = new Date();
    const evolution = [];
    const labels = [];

    for (let i = 11; i >= 0; i--) {
      const monthDate = new Date(today.getFullYear(), today.getMonth() - i, 1);
      const nextMonth = new Date(today.getFullYear(), today.getMonth() - i + 1, 1);
      
      const newClientsInMonth = allClients.filter(c => {
        const created = new Date(c.created_at);
        return created >= monthDate && created < nextMonth;
      }).length;
      
      evolution.push(newClientsInMonth);
      labels.push(monthDate.toLocaleDateString('es-AR', { month: 'short', year: '2-digit' }));
    }

    // Distribución geográfica (top 5 provincias/ciudades)
    const locationCounts = {};
    filteredClients.forEach(c => {
      const location = c.province || c.city || 'Sin especificar';
      locationCounts[location] = (locationCounts[location] || 0) + 1;
    });

    const geographic = Object.entries(locationCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([location, count]) => ({ label: location, value: count }));

    return {
      topByRevenue: {
        labels: topByRevenue.map(item => item.label),
        data: topByRevenue.map(item => item.value)
      },
      byType: {
        data: [companies, persons]
      },
      byProjects: {
        labels: Object.keys(projectDistribution),
        data: Object.values(projectDistribution)
      },
      evolution: {
        labels,
        data: evolution
      },
      geographic: {
        labels: geographic.map(item => item.label),
        data: geographic.map(item => item.value)
      }
    };
  }

  // Construir tablas
  static buildTables(filteredClients, projects, invoices) {
    // Calcular datos por cliente
    const clientData = filteredClients.map(client => {
      const clientId = client._id.toString();
      
      // Proyectos del cliente
      const clientProjects = projects.filter(p => 
        p.client_id?._id?.toString() === clientId
      );
      
      // Facturación del cliente
      const revenue = invoices
        .filter(inv => {
          const invClientId = inv.estimate_id?.project_id?.client_id?._id?.toString();
          return invClientId === clientId;
        })
        .reduce((sum, inv) => sum + (inv.total_amount || 0), 0);
      
      // Última actividad
      const lastProject = clientProjects
        .sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at))[0];
      
      const lastActivity = lastProject 
        ? new Date(lastProject.updated_at).toLocaleDateString('es-AR')
        : 'Sin actividad';
      
      // Nombre del cliente
      const name = client.client_type === 'company'
        ? client.name
        : `${client.first_name} ${client.last_name}`;
      
      // Días inactivos
      const daysInactive = lastProject 
        ? Math.floor((new Date() - new Date(lastProject.updated_at)) / (1000 * 60 * 60 * 24))
        : 999;
      
      return {
        id: clientId,
        code: client.code || 'N/A',
        name,
        type: client.client_type,
        projects: clientProjects.length,
        revenue,
        contacts: 0, // Se llenará después
        active: clientProjects.some(p => p.status !== 'completed' && p.status !== 'cancelled'),
        lastActivity,
        daysInactive
      };
    });

    // Top 5 VIP (mayor facturación)
    const vipClients = clientData
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5)
      .map(c => ({
        name: c.name,
        projects: c.projects,
        revenue: c.revenue,
        lastActivity: c.lastActivity
      }));

    // Clientes en riesgo (sin actividad en 90+ días)
    const riskClients = clientData
      .filter(c => c.daysInactive > 90 && c.active)
      .sort((a, b) => b.daysInactive - a.daysInactive)
      .slice(0, 5)
      .map(c => ({
        id: c.id,
        name: c.name,
        reason: c.daysInactive > 180 ? 'Sin actividad >180 días' : 'Sin actividad >90 días',
        daysInactive: c.daysInactive
      }));

    // Detalle completo
    const detail = clientData.sort((a, b) => b.revenue - a.revenue);

    return {
      vipClients,
      riskClients,
      detail
    };
  }

  // Calcular métricas adicionales
  static calculateMetrics(filteredClients, allContacts, projects, invoices) {
    const clientIds = new Set(filteredClients.map(c => c._id.toString()));

    // Contactos
    const relevantContacts = allContacts.filter(contact => 
      clientIds.has(contact.client_id?.toString())
    );
    
    const totalContacts = relevantContacts.length;
    const avgContactsPerClient = filteredClients.length > 0 
      ? totalContacts / filteredClients.length 
      : 0;
    
    // Clientes sin contactos
    const clientsWithContacts = new Set(
      relevantContacts.map(c => c.client_id?.toString())
    );
    const clientsWithoutContacts = filteredClients.filter(c => 
      !clientsWithContacts.has(c._id.toString())
    ).length;

    // Satisfacción simulada basada en tasa de retención y facturación
    const projectsByClient = {};
    projects.forEach(p => {
      const clientId = p.client_id?._id?.toString();
      if (clientId && clientIds.has(clientId)) {
        projectsByClient[clientId] = (projectsByClient[clientId] || 0) + 1;
      }
    });

    const recurringClientsCount = filteredClients.filter(c => 
      (projectsByClient[c._id.toString()] || 0) > 1
    ).length;

    const highSatisfaction = recurringClientsCount;
    const mediumSatisfaction = Math.floor((filteredClients.length - recurringClientsCount) * 0.6);
    const lowSatisfaction = filteredClients.length - highSatisfaction - mediumSatisfaction;

    const satisfactionScore = filteredClients.length > 0
      ? Math.round((highSatisfaction * 100 + mediumSatisfaction * 70 + lowSatisfaction * 40) / filteredClients.length)
      : 85;

    return {
      totalContacts,
      avgContactsPerClient,
      clientsWithoutContacts,
      satisfactionScore,
      highSatisfaction,
      mediumSatisfaction,
      lowSatisfaction
    };
  }
}

export default ClientReportController;
