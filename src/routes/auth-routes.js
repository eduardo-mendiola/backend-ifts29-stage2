import express from 'express';
import passport from '../config/passport.js';
import { isAuthenticated, redirectIfAuthenticated } from '../middleware/authMiddleware.js';
import * as AuthController from '../controllers/AuthController.js';

const router = express.Router();

/**
 * Rutas públicas - Autenticación
 */

// Mostrar login (index.pug)
router.get('/', redirectIfAuthenticated, AuthController.showLogin);

// Procesar login
router.post('/login', 
  redirectIfAuthenticated,
  passport.authenticate('local', {
    successRedirect: '/admin/dashboard',
    failureRedirect: '/',
    failureFlash: true
  })
);

// Registro deshabilitado - Solo admins pueden crear usuarios
// router.get('/register', redirectIfAuthenticated, AuthController.showRegister);
// router.post('/register', redirectIfAuthenticated, AuthController.register);

// Logout
router.get('/logout', AuthController.logout);
router.post('/logout', AuthController.logout);

/**
 * Rutas protegidas - Requieren autenticación
 */

// Dashboard principal
router.get('/admin/dashboard', isAuthenticated, AuthController.showDashboard);

// Perfil de usuario
router.get('/profile', isAuthenticated, AuthController.showProfile);

export default router;
