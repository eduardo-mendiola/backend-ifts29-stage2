import jwt from 'jsonwebtoken';
import UserModel from '../models/UserModel.js';

/**
 * Extrae el token JWT del header Authorization
 * @param {Object} req - Request object
 * @returns {string|null} - Token JWT o null
 */
const getTokenFromHeaders = (req) => {
  const authHeader = req.headers.authorization;
  
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7);
  }
  
  return null;
};

/**
 * Middleware para proteger rutas API con JWT
 * Verifica el token y adjunta el usuario a req.user
 */
export const requireToken = async (req, res, next) => {
  try {
    const token = getTokenFromHeaders(req);
    
    if (!token) {
      return res.status(401).json({ 
        success: false, 
        message: 'Token no proporcionado. Se requiere autenticación.' 
      });
    }

    // Verificar y decodificar el token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Buscar usuario por ID del token
    const user = await UserModel.model.findById(decoded.userId)
      .populate('role_id')
      .select('-password_hash');
    
    if (!user) {
      return res.status(401).json({ 
        success: false, 
        message: 'Usuario no encontrado' 
      });
    }

    if (!user.is_active) {
      return res.status(401).json({ 
        success: false, 
        message: 'Usuario inactivo. Contacta al administrador.' 
      });
    }

    // Adjuntar usuario completo a la petición
    req.user = user;
    next();
  } catch (error) {
    // Manejar errores específicos de JWT
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ 
        success: false, 
        message: 'Token inválido o malformado' 
      });
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        success: false, 
        message: 'Token expirado. Por favor, inicia sesión nuevamente.' 
      });
    }

    console.error('Error al verificar token:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Error interno al verificar autenticación' 
    });
  }
};

/**
 * Middleware opcional - no falla si no hay token
 * Útil para rutas que funcionan con o sin autenticación
 */
export const optionalToken = async (req, res, next) => {
  try {
    const token = getTokenFromHeaders(req);
    
    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await UserModel.model.findById(decoded.userId)
        .populate('role_id')
        .select('-password_hash');
      
      if (user && user.is_active) {
        req.user = user;
      }
    }
    
    next();
  } catch (error) {
    // Continuar sin usuario autenticado
    next();
  }
};

/**
 * Genera un nuevo token JWT para un usuario
 * @param {string} userId - ID del usuario
 * @param {string} expiresIn - Tiempo de expiración (por defecto 7 días)
 * @returns {string} - Token JWT firmado
 */
export const generateToken = (userId, expiresIn = '7d') => {
  return jwt.sign(
    { userId },
    process.env.JWT_SECRET,
    { expiresIn }
  );
};

/**
 * Middleware para verificar roles específicos (para API)
 * Usar después de requireToken
 */
export const requireRole = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'No autenticado'
      });
    }

    const userRole = req.user.role_id?.name;
    
    if (!allowedRoles.includes(userRole)) {
      return res.status(403).json({
        success: false,
        message: 'No tienes permisos para realizar esta acción'
      });
    }

    next();
  };
};

export default {
  requireToken,
  optionalToken,
  generateToken,
  requireRole
};
