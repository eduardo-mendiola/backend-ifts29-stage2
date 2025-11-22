import cron from 'node-cron';
import RoleExpirationService from '../services/RoleExpirationService.js';

/**
 * Scheduler para tareas programadas relacionadas con roles temporales
 */
class RoleExpirationScheduler {
  constructor() {
    this.tasks = [];
  }

  /**
   * Inicia todas las tareas programadas
   */
  start() {
    console.log('🕐 Iniciando scheduler de roles temporales...');

    // Tarea que se ejecuta cada minuto para verificar roles expirados
    const checkExpiredRolesTask = cron.schedule('* * * * *', async () => {
      try {
        console.log('⏰ Ejecutando verificación de roles expirados...');
        await RoleExpirationService.processExpiredRoles();
      } catch (error) {
        console.error('Error en tarea programada de roles expirados:', error);
      }
    });

    this.tasks.push(checkExpiredRolesTask);

    // Tarea que se ejecuta cada 6 horas para mostrar el estado de roles temporales
    const statusReportTask = cron.schedule('0 */6 * * *', async () => {
      try {
        console.log('📊 Generando reporte de roles temporales...');
        const status = await RoleExpirationService.getTemporaryRolesStatus();
        
        if (status.length > 0) {
          console.log(`📋 Roles temporales activos: ${status.length}`);
          status.forEach(user => {
            console.log(`  - ${user.username}: ${user.currentRole} → ${user.fallbackRole} (${user.isExpired ? 'EXPIRADO' : 'Activo'})`);
          });
        } else {
          console.log('✅ No hay roles temporales activos');
        }
      } catch (error) {
        console.error('Error generando reporte de roles temporales:', error);
      }
    });

    this.tasks.push(statusReportTask);

    console.log('✅ Scheduler de roles temporales iniciado');
    console.log('   - Verificación de expiración: cada minuto');
    console.log('   - Reporte de estado: cada 6 horas');
  }

  /**
   * Detiene todas las tareas programadas
   */
  stop() {
    console.log('🛑 Deteniendo scheduler de roles temporales...');
    this.tasks.forEach(task => task.stop());
    this.tasks = [];
    console.log('✅ Scheduler detenido');
  }

  /**
   * Ejecuta manualmente la verificación de roles expirados (útil para testing)
   */
  async runManualCheck() {
    console.log('🔄 Ejecutando verificación manual de roles expirados...');
    try {
      const results = await RoleExpirationService.processExpiredRoles();
      console.log(`✅ Verificación manual completada. ${results.length} usuario(s) actualizados`);
      return results;
    } catch (error) {
      console.error('Error en verificación manual:', error);
      throw error;
    }
  }
}

export default new RoleExpirationScheduler();
