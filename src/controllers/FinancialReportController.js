import Invoice from '../models/InvoiceModel.js';
import Expense from '../models/ExpenseModel.js';
import Payment from '../models/PaymentModel.js';
import Client from '../models/ClientModel.js';
import ExpenseCategory from '../models/ExpenseCategoryModel.js';

/**
 * FinancialReportController
 * Controlador para el dashboard de reportes financieros
 */
class FinancialReportController {
  
  /**
   * Renderizar la vista del reporte financiero
   */
  static async renderView(req, res, next) {
    try {
      res.render('financial-report', {
        title: 'Reporte Financiero',
        user: req.user
      });
    } catch (error) {
      console.error('Error al renderizar reporte financiero:', error);
      next(error);
    }
  }

  /**
   * API: Obtener datos del reporte financiero
   */
  static async getReportData(req, res, next) {
    try {
      const period = req.query.period || 'current';
      const { startDate, endDate, prevStartDate, prevEndDate } = FinancialReportController.getDateRange(period);

      // Obtener datos en paralelo
      const [
        summary,
        monthlyData,
        expensesByCategory,
        invoiceStatus,
        paymentMethods,
        topClients,
        recentInvoices,
        recentExpenses
      ] = await Promise.all([
        FinancialReportController.getSummary(startDate, endDate, prevStartDate, prevEndDate),
        FinancialReportController.getMonthlyData(),
        FinancialReportController.getExpensesByCategory(startDate, endDate),
        FinancialReportController.getInvoiceStatus(startDate, endDate),
        FinancialReportController.getPaymentMethods(startDate, endDate),
        FinancialReportController.getTopClients(startDate, endDate),
        FinancialReportController.getRecentInvoices(),
        FinancialReportController.getRecentExpenses()
      ]);

      res.json({
        summary,
        charts: {
          monthly: monthlyData,
          expensesByCategory,
          invoiceStatus,
          paymentMethods,
          topClients
        },
        tables: {
          recentInvoices,
          recentExpenses
        }
      });

    } catch (error) {
      console.error('Error al obtener datos del reporte financiero:', error);
      next(error);
    }
  }

  /**
   * Calcular rangos de fechas según el período seleccionado
   */
  static getDateRange(period) {
    const now = new Date();
    let startDate, endDate, prevStartDate, prevEndDate;

    switch (period) {
      case 'last': // Mes anterior
        startDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        endDate = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59);
        prevStartDate = new Date(now.getFullYear(), now.getMonth() - 2, 1);
        prevEndDate = new Date(now.getFullYear(), now.getMonth() - 1, 0, 23, 59, 59);
        break;

      case 'quarter': // Último trimestre
        const quarterMonth = Math.floor(now.getMonth() / 3) * 3;
        startDate = new Date(now.getFullYear(), quarterMonth - 3, 1);
        endDate = new Date(now.getFullYear(), quarterMonth, 0, 23, 59, 59);
        prevStartDate = new Date(now.getFullYear(), quarterMonth - 6, 1);
        prevEndDate = new Date(now.getFullYear(), quarterMonth - 3, 0, 23, 59, 59);
        break;

      case 'year': // Año actual
        startDate = new Date(now.getFullYear(), 0, 1);
        endDate = new Date(now.getFullYear(), 11, 31, 23, 59, 59);
        prevStartDate = new Date(now.getFullYear() - 1, 0, 1);
        prevEndDate = new Date(now.getFullYear() - 1, 11, 31, 23, 59, 59);
        break;

      default: // Mes actual
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);
        prevStartDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        prevEndDate = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59);
    }

    return { startDate, endDate, prevStartDate, prevEndDate };
  }

  /**
   * Obtener resumen financiero (cards principales)
   */
  static async getSummary(startDate, endDate, prevStartDate, prevEndDate) {
    // Ingresos del período actual (facturas pagadas)
    const currentInvoices = await Invoice.model.find({
      status: 'paid',
      issue_date: { $gte: startDate, $lte: endDate }
    });
    const totalIncome = currentInvoices.reduce((sum, inv) => sum + inv.total_amount, 0);

    // Ingresos del período anterior
    const prevInvoices = await Invoice.model.find({
      status: 'paid',
      issue_date: { $gte: prevStartDate, $lte: prevEndDate }
    });
    const prevTotalIncome = prevInvoices.reduce((sum, inv) => sum + inv.total_amount, 0);
    const incomeChange = prevTotalIncome > 0 
      ? ((totalIncome - prevTotalIncome) / prevTotalIncome) * 100 
      : 0;

    // Gastos del período actual
    const currentExpenses = await Expense.model.find({
      date: { $gte: startDate, $lte: endDate }
    });
    const totalExpenses = currentExpenses.reduce((sum, exp) => sum + exp.amount, 0);

    // Gastos del período anterior
    const prevExpenses = await Expense.model.find({
      date: { $gte: prevStartDate, $lte: prevEndDate }
    });
    const prevTotalExpenses = prevExpenses.reduce((sum, exp) => sum + exp.amount, 0);
    const expensesChange = prevTotalExpenses > 0 
      ? ((totalExpenses - prevTotalExpenses) / prevTotalExpenses) * 100 
      : 0;

    // Balance neto
    const netBalance = totalIncome - totalExpenses;
    const prevNetBalance = prevTotalIncome - prevTotalExpenses;
    const balanceChange = prevNetBalance !== 0 
      ? ((netBalance - prevNetBalance) / Math.abs(prevNetBalance)) * 100 
      : 0;

    // Cuentas por cobrar (facturas generadas pero no pagadas)
    const pendingInvoices = await Invoice.model.find({
      status: 'generated'
    });
    const accountsReceivable = pendingInvoices.reduce((sum, inv) => sum + inv.total_amount, 0);
    const receivableCount = pendingInvoices.length;

    return {
      totalIncome,
      totalExpenses,
      netBalance,
      accountsReceivable,
      receivableCount,
      incomeChange,
      expensesChange,
      balanceChange
    };
  }

  /**
   * Obtener datos mensuales para gráfico de evolución (últimos 6 meses)
   */
  static async getMonthlyData() {
    const labels = [];
    const incomeData = [];
    const expensesData = [];
    
    const now = new Date();
    
    for (let i = 5; i >= 0; i--) {
      const month = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthEnd = new Date(now.getFullYear(), now.getMonth() - i + 1, 0, 23, 59, 59);
      
      // Nombre del mes
      labels.push(month.toLocaleDateString('es-AR', { month: 'short', year: '2-digit' }));
      
      // Ingresos del mes
      const monthInvoices = await Invoice.model.find({
        status: 'paid',
        issue_date: { $gte: month, $lte: monthEnd }
      });
      const monthIncome = monthInvoices.reduce((sum, inv) => sum + inv.total_amount, 0);
      incomeData.push(monthIncome);
      
      // Gastos del mes
      const monthExpenses = await Expense.model.find({
        date: { $gte: month, $lte: monthEnd }
      });
      const monthExpense = monthExpenses.reduce((sum, exp) => sum + exp.amount, 0);
      expensesData.push(monthExpense);
    }

    return {
      labels,
      income: incomeData,
      expenses: expensesData
    };
  }

  /**
   * Obtener gastos por categoría
   */
  static async getExpensesByCategory(startDate, endDate) {
    const expenses = await Expense.model.find({
      date: { $gte: startDate, $lte: endDate }
    }).populate('category_id');

    const categoryMap = new Map();
    
    expenses.forEach(exp => {
      const categoryName = exp.category_id?.name || 'Sin categoría';
      const current = categoryMap.get(categoryName) || 0;
      categoryMap.set(categoryName, current + exp.amount);
    });

    // Ordenar por monto y tomar top 5
    const sorted = Array.from(categoryMap.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);

    return {
      labels: sorted.map(item => item[0]),
      data: sorted.map(item => item[1])
    };
  }

  /**
   * Obtener estado de facturas
   */
  static async getInvoiceStatus(startDate, endDate) {
    const now = new Date();
    
    const invoices = await Invoice.model.find({
      issue_date: { $gte: startDate, $lte: endDate }
    });

    let paid = 0;
    let pending = 0;
    let overdue = 0;

    invoices.forEach(inv => {
      if (inv.status === 'paid') {
        paid++;
      } else if (inv.status === 'generated') {
        // Verificar si está atrasada
        if (inv.due_date && new Date(inv.due_date) < now) {
          overdue++;
        } else {
          pending++;
        }
      }
    });

    return {
      data: [paid, pending, overdue]
    };
  }

  /**
   * Obtener métodos de pago utilizados
   */
  static async getPaymentMethods(startDate, endDate) {
    const payments = await Payment.model.find({
      payment_date: { $gte: startDate, $lte: endDate }
    });

    const methodMap = new Map();
    
    payments.forEach(payment => {
      const method = payment.payment_method || 'Otros';
      const current = methodMap.get(method) || 0;
      methodMap.set(method, current + payment.amount);
    });

    return {
      labels: Array.from(methodMap.keys()),
      data: Array.from(methodMap.values())
    };
  }

  /**
   * Obtener top 5 clientes por facturación
   */
  static async getTopClients(startDate, endDate) {
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
        const current = clientMap.get(clientId) || { name: clientName, total: 0 };
        current.total += inv.total_amount;
        clientMap.set(clientId, current);
      }
    });

    // Ordenar y tomar top 5
    return Array.from(clientMap.values())
      .sort((a, b) => b.total - a.total)
      .slice(0, 5);
  }

  /**
   * Obtener últimas 10 facturas
   */
  static async getRecentInvoices() {
    const invoices = await Invoice.model.find()
      .populate({
        path: 'estimate_id',
        populate: {
          path: 'project_id',
          populate: 'client_id'
        }
      })
      .sort({ issue_date: -1 })
      .limit(10);

    return invoices.map(inv => {
      const client = inv.estimate_id?.project_id?.client_id;
      let clientName = 'N/A';
      if (client) {
        if (client.client_type === 'company') {
          clientName = client.name || 'Sin nombre';
        } else {
          clientName = (client.first_name || '') + ' ' + (client.last_name || '').trim() || 'Sin nombre';
        }
      }
      return {
        invoice_number: inv.invoice_number,
        code: inv.code,
        client_name: clientName,
        total_amount: inv.total_amount,
        status: inv.status
      };
    });
  }

  /**
   * Obtener últimos 10 gastos
   */
  static async getRecentExpenses() {
    const expenses = await Expense.model.find()
      .populate('category_id')
      .sort({ date: -1 })
      .limit(10);

    return expenses.map(exp => ({
      description: exp.description,
      category: exp.category_id?.name || 'Sin categoría',
      amount: exp.amount,
      date: exp.date
    }));
  }
}

export default FinancialReportController;
