import RoleExpirationService from '../services/RoleExpirationService.js';

/**
 * Middleware para verificar si el rol del usuario autenticado ha expirado
 * Se ejecuta en cada request autenticado para asegurar que el usuario
 * tenga el rol correcto según las configuraciones de expiración
 */
const checkRoleExpiration = async (req, res, next) => {
  try {
    // Solo verificar si hay un usuario autenticado
    if (!req.user || !req.user.id) {
      return next();
    }

    // Verificar y revertir el rol si ha expirado
    const updatedUser = await RoleExpirationService.checkAndRevertExpiredRole(req.user.id);

    // Si el usuario fue actualizado (rol expirado), actualizar req.user
    if (updatedUser) {
      console.log(`🔄 Rol actualizado para usuario ${req.user.username}: rol temporal expirado`);
      
      // Actualizar el objeto de usuario en la sesión/request
      // Esto asegura que los permisos se verifiquen con el nuevo rol
      req.user.role_id = updatedUser.role_id;
      req.user.is_temporary_role = updatedUser.is_temporary_role;
      
      // Opcional: Agregar un mensaje flash para informar al usuario
      if (req.flash) {
        req.flash('info', 'Tu rol temporal ha expirado y has sido asignado a tu rol permanente.');
      }
    }

    next();
  } catch (error) {
    console.error('Error en middleware checkRoleExpiration:', error);
    // No detener el flujo de la aplicación por un error en la verificación
    // Simplemente continuar con el siguiente middleware
    next();
  }
};

export default checkRoleExpiration;
