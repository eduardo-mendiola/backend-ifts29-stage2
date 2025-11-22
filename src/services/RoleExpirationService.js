import User from '../models/UserModel.js';

class RoleExpirationService {
  /**
   * Verifica si un usuario tiene un rol expirado y lo revierte al rol de fallback
   * @param {string} userId - ID del usuario a verificar
   * @returns {Object|null} Usuario actualizado o null si no había expiración
   */
  async checkAndRevertExpiredRole(userId) {
    try {
      const user = await User.findById(userId);
      
      if (!user) {
        console.log(`Usuario ${userId} no encontrado`);
        return null;
      }

      // Si no tiene rol temporal, no hay nada que hacer
      if (!user.is_temporary_role) {
        return null;
      }

      // Verificar si el rol ha expirado
      const now = new Date();
      if (user.role_expiration_date && now >= user.role_expiration_date) {
        console.log(`⏰ Rol temporal expirado para usuario ${user.username}`);
        
        // Revertir al rol de fallback
        const updatedUser = await User.revertToFallbackRole(userId);
        
        if (updatedUser) {
          console.log(`✅ Usuario ${user.username} revertido al rol de fallback`);
          return updatedUser;
        }
      }

      return null;
    } catch (error) {
      console.error('Error verificando expiración de rol:', error);
      throw error;
    }
  }

  /**
   * Procesa todos los usuarios con roles expirados (para ejecución batch)
   * @returns {Array} Lista de usuarios actualizados
   */
  async processExpiredRoles() {
    try {
      const usersWithExpiredRoles = await User.findUsersWithExpiredRoles();
      
      if (usersWithExpiredRoles.length === 0) {
        console.log('No hay usuarios con roles expirados');
        return [];
      }

      console.log(`🔍 Procesando ${usersWithExpiredRoles.length} usuario(s) con roles expirados`);
      
      const updatedUsers = [];
      
      for (const user of usersWithExpiredRoles) {
        try {
          const updated = await User.revertToFallbackRole(user._id);
          if (updated) {
            updatedUsers.push(updated);
            console.log(`✅ Usuario ${user.username} revertido de ${user.role_id?.name || 'N/A'} a ${user.fallback_role_id?.name || 'N/A'}`);
          }
        } catch (error) {
          console.error(`Error revertiendo rol para usuario ${user.username}:`, error);
        }
      }

      console.log(`✅ Procesados ${updatedUsers.length} usuario(s)`);
      return updatedUsers;
    } catch (error) {
      console.error('Error procesando roles expirados:', error);
      throw error;
    }
  }

  /**
   * Configura un rol temporal para un usuario
   * @param {string} userId - ID del usuario
   * @param {string} temporaryRoleId - ID del rol temporal
   * @param {number} durationValue - Valor de la duración
   * @param {string} durationUnit - Unidad de tiempo (seconds, minutes, hours, days, months)
   * @param {string} fallbackRoleId - ID del rol de fallback
   * @returns {Object} Usuario actualizado
   */
  async setTemporaryRole(userId, temporaryRoleId, durationValue, durationUnit, fallbackRoleId) {
    try {
      const user = await User.findById(userId);
      
      if (!user) {
        throw new Error('Usuario no encontrado');
      }

      // Calcular fecha de expiración
      const expirationDate = User.calculateRoleExpiration(durationUnit, durationValue);

      // Actualizar usuario
      const updateData = {
        role_id: temporaryRoleId,
        is_temporary_role: true,
        role_expiration_date: expirationDate,
        role_duration_value: durationValue,
        role_duration_unit: durationUnit,
        fallback_role_id: fallbackRoleId
      };

      const updatedUser = await User.update(userId, updateData);
      
      console.log(`✅ Rol temporal configurado para ${user.username}. Expira: ${expirationDate.toLocaleString()}`);
      
      return updatedUser;
    } catch (error) {
      console.error('Error configurando rol temporal:', error);
      throw error;
    }
  }

  /**
   * Obtiene información sobre roles temporales activos
   * @returns {Array} Lista de usuarios con roles temporales y su estado
   */
  async getTemporaryRolesStatus() {
    try {
      const users = await User.model.find({
        is_temporary_role: true
      }).populate(['role_id', 'fallback_role_id']);

      const now = new Date();

      return users.map(user => ({
        userId: user._id,
        username: user.username,
        currentRole: user.role_id?.name || 'N/A',
        fallbackRole: user.fallback_role_id?.name || 'N/A',
        expirationDate: user.role_expiration_date,
        isExpired: user.role_expiration_date && now >= user.role_expiration_date,
        timeRemaining: user.role_expiration_date 
          ? Math.max(0, user.role_expiration_date - now) 
          : null,
        duration: `${user.role_duration_value} ${user.role_duration_unit}`
      }));
    } catch (error) {
      console.error('Error obteniendo estado de roles temporales:', error);
      throw error;
    }
  }
}

export default new RoleExpirationService();
