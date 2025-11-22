/**
 * Middleware para prevenir el cacheo del navegador
 * Agrega headers HTTP que instruyen al navegador a no cachear contenido sensible
 * Esto previene que usuarios puedan ver páginas anteriores con el botón "atrás" después de logout
 */
export const noCacheHeaders = (req, res, next) => {
  res.set({
    'Cache-Control': 'no-store, no-cache, must-revalidate, private',
    'Pragma': 'no-cache',
    'Expires': '0'
  });
  next();
};

/**
 * Middleware para proteger rutas web (vistas Pug)
 * Verifica si el usuario está autenticado mediante sesión de Passport
 */
export const isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  
  // Guardar la URL a la que intentaba acceder
  req.session.returnTo = req.originalUrl;
  req.flash('error', 'Debes iniciar sesión para acceder a esta página');
  res.redirect('/');
};

/**
 * Middleware para verificar roles específicos en rutas web
 * Usar después de isAuthenticated
 * @param {...string} roles - Roles permitidos
 */
export const hasRole = (...roles) => {
  return (req, res, next) => {
    if (!req.isAuthenticated()) {
      req.flash('error', 'Debes iniciar sesión');
      return res.redirect('/');
    }

    const userRole = req.user.role_id?.name;

    if (!roles.includes(userRole)) {
      return res.status(403).render('error403', {
        title: 'Acceso Denegado',
        message: 'No tienes permisos para acceder a esta página',
        user: req.user
      });
    }

    next();
  };
};

/**
 * Middleware para redirigir usuarios ya autenticados
 * Útil para login/register - evita que usuarios logueados accedan
 */
export const redirectIfAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return res.redirect('/admin/dashboard');
  }
  next();
};

/**
 * Middleware para verificar permisos específicos
 */
export const hasPermission = (permission) => {
  return (req, res, next) => {
    if (!req.isAuthenticated()) {
      req.flash('error', 'Debes iniciar sesión');
      return res.redirect('/');
    }

    // Verificar si el rol tiene el permiso (ajusta según tu estructura)
    const userPermissions = req.user.role_id?.permissions || [];
    
    if (!userPermissions.includes(permission)) {
      return res.status(403).render('error403', {
        title: 'Acceso Denegado',
        message: 'No tienes los permisos necesarios para realizar esta acción',
        user: req.user
      });
    }

    next();
  };
};

export default {
  isAuthenticated,
  hasRole,
  redirectIfAuthenticated,
  hasPermission
};
