/**
 * Middleware para control de acceso basado en permisos
 */

/**
 * Verifica si un usuario tiene un permiso específico
 * @param {Object} user - Usuario con role_id y permissions
 * @param {String} permission - Permiso a verificar
 * @returns {Boolean}
 */
export const hasPermission = (user, permission) => {
  if (!user || !user.role_id) return false;
  
  const rolePermissions = user.role_id.permissions || [];
  return rolePermissions.includes(permission);
};

/**
 * Verifica si un usuario tiene al menos uno de los permisos especificados
 * @param {Object} user - Usuario con role_id y permissions
 * @param {Array} permissions - Array de permisos a verificar
 * @returns {Boolean}
 */
export const hasAnyPermission = (user, permissions) => {
  if (!user || !user.role_id) return false;
  
  const rolePermissions = user.role_id.permissions || [];
  return permissions.some(perm => rolePermissions.includes(perm));
};

/**
 * Middleware para verificar un permiso específico
 * @param {String} permission - Permiso requerido
 */
export const requirePermission = (permission) => {
  return (req, res, next) => {
    const user = req.user || req.session?.user;
    
    if (!user) {
      // Para peticiones JSON (API), responder con JSON
      if (req.xhr || req.headers.accept?.indexOf('json') > -1) {
        return res.status(401).json({ 
          message: 'No autenticado. Debe iniciar sesión para acceder a este recurso'
        });
      }
      // Para peticiones HTML, renderizar vista de error
      return res.status(401).render('error403', { 
        title: 'Acceso Denegado',
        message: 'Debe iniciar sesión para acceder a este recurso'
      });
    }

    if (!hasPermission(user, permission)) {
      // Para peticiones JSON (API), responder con JSON
      if (req.xhr || req.headers.accept?.indexOf('json') > -1) {
        return res.status(403).json({ 
          message: `Permiso denegado. Se requiere: ${permission}`
        });
      }
      // Para peticiones HTML, renderizar vista de error
      return res.status(403).render('error403', { 
        title: 'Acceso Denegado',
        message: 'No tiene permisos suficientes para realizar esta acción'
      });
    }

    next();
  };
};

/**
 * Middleware para verificar múltiples permisos (requiere al menos uno)
 * @param {Array} permissions - Array de permisos
 */
export const requireAnyPermission = (permissions) => {
  return (req, res, next) => {
    const user = req.user || req.session?.user;
    
    if (!user) {
      return res.status(401).render('error403', { 
        title: 'Acceso Denegado',
        message: 'Debe iniciar sesión para acceder a este recurso'
      });
    }

    if (!hasAnyPermission(user, permissions)) {
      return res.status(403).render('error403', { 
        title: 'Acceso Denegado',
        message: 'No tiene permisos suficientes para acceder a este recurso'
      });
    }

    next();
  };
};

/**
 * Middleware para inyectar funciones de permisos en res.locals (para vistas Pug)
 */
export const injectPermissionHelpers = (req, res, next) => {
  const user = req.user || req.session?.user;
  
  res.locals.hasPermission = (permission) => hasPermission(user, permission);
  res.locals.hasAny = (permissions) => hasAnyPermission(user, permissions);
  res.locals.currentUser = user;
  
  next();
};
