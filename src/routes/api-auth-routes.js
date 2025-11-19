import express from 'express';
import { requireToken, optionalToken, requireRole } from '../config/jwtMiddleware.js';
import * as ApiAuthController from '../controllers/ApiAuthController.js';

const router = express.Router();

/**
 * Rutas de autenticación API - No requieren token
 */

// Login - Obtener token JWT
router.post('/login', ApiAuthController.loginAPI);

// Registro - Crear usuario y obtener token
router.post('/register', ApiAuthController.registerAPI);

/**
 * Rutas protegidas - Requieren token JWT válido
 */

// Validar token actual
router.get('/validate', requireToken, ApiAuthController.validateToken);

// Obtener perfil del usuario autenticado
router.get('/profile', requireToken, ApiAuthController.getProfile);

// Actualizar perfil
router.put('/profile', requireToken, ApiAuthController.updateProfile);

// Cambiar contraseña
router.put('/change-password', requireToken, ApiAuthController.changePassword);

/**
 * Ejemplo de ruta protegida por rol
 * Solo administradores pueden acceder
 */
router.get('/admin-only', 
  requireToken, 
  requireRole('admin'), 
  (req, res) => {
    res.json({
      success: true,
      message: 'Acceso de administrador',
      user: req.user
    });
  }
);

export default router;
