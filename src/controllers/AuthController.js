import UserModel from '../models/UserModel.js';
import RoleModel from '../models/RoleModel.js';

/**
 * AuthController - Manejo de autenticación para vistas web (Pug)
 */

/**
 * Mostrar página de login (index.pug ya tiene el formulario)
 */
export const showLogin = (req, res) => {
  if (req.isAuthenticated()) {
    return res.redirect('/admin/dashboard');
  }
  
  // Los mensajes flash ya están disponibles en res.locals gracias al middleware en app.js
  // No es necesario pasarlos nuevamente, evita consumirlos dos veces
  res.render('index', { 
    title: 'ClickWave - Iniciar Sesión'
  });
};

/**
 * Procesar login - Passport se encarga de la autenticación
 * Esta función se ejecuta después de autenticación exitosa
 */
export const processLogin = (req, res) => {
  const returnTo = req.session.returnTo || '/admin/dashboard';
  delete req.session.returnTo;
  
  req.flash('success', `Bienvenido, ${req.user.username}`);
  res.redirect(returnTo);
};

/**
 * Procesar logout
 */
export const logout = (req, res, next) => {
  req.logout((err) => {
    if (err) {
      console.error('Error al cerrar sesión:', err);
      return next(err);
    }
    req.flash('success', 'Sesión cerrada exitosamente');
    res.redirect('/');
  });
};

/**
 * Mostrar formulario de registro
 */
export const showRegister = (req, res) => {
  if (req.isAuthenticated()) {
    return res.redirect('/admin/dashboard');
  }
  
  res.render('register', { 
    title: 'ClickWave - Registro',
    error: req.flash('error')
  });
};

/**
 * Procesar registro de nuevo usuario
 */
export const register = async (req, res) => {
  try {
    const { username, email, password, password_confirm } = req.body;

    // Validaciones
    if (!username || !email || !password) {
      req.flash('error', 'Todos los campos son requeridos');
      return res.redirect('/register');
    }

    if (password !== password_confirm) {
      req.flash('error', 'Las contraseñas no coinciden');
      return res.redirect('/register');
    }

    if (password.length < 6) {
      req.flash('error', 'La contraseña debe tener al menos 6 caracteres');
      return res.redirect('/register');
    }

    // Verificar si el usuario ya existe
    const existingUser = await UserModel.model.findOne({ 
      $or: [{ username }, { email }] 
    });

    if (existingUser) {
      req.flash('error', 'El usuario o email ya está registrado');
      return res.redirect('/register');
    }

    // Obtener rol por defecto (usuario)
    let defaultRole = await RoleModel.model.findOne({ name: 'user' });
    
    if (!defaultRole) {
      // Si no existe, crear rol por defecto
      defaultRole = await RoleModel.create({
        name: 'user',
        description: 'Usuario estándar'
      });
    }

    // Generar código único
    const userCount = await UserModel.model.countDocuments();
    const code = `USR-${String(userCount + 1).padStart(4, '0')}`;

    // Crear usuario (el password_hash se hasheará automáticamente)
    const newUser = new UserModel.model({
      code,
      username,
      email,
      password_hash: password, // Se hasheará en el pre-save hook
      role_id: defaultRole._id,
      is_active: true
    });

    await newUser.save();

    req.flash('success', 'Registro exitoso. Por favor inicia sesión.');
    res.redirect('/');
  } catch (error) {
    console.error('Error en registro:', error);
    req.flash('error', 'Error al registrar usuario. Intenta nuevamente.');
    res.redirect('/register');
  }
};

/**
 * Mostrar dashboard principal
 */
export const showDashboard = async (req, res) => {
  try {
    res.render('admin', {
      title: 'Dashboard - ClickWave',
      user: req.user
    });
  } catch (error) {
    console.error('Error al cargar dashboard:', error);
    res.status(500).render('error500', {
      title: 'Error',
      message: 'Error al cargar el dashboard',
      user: req.user
    });
  }
};

/**
 * Mostrar perfil de usuario
 */
export const showProfile = async (req, res) => {
  try {
    res.render('profile', {
      title: 'Mi Perfil',
      user: req.user
    });
  } catch (error) {
    console.error('Error al cargar perfil:', error);
    res.status(500).render('error500', {
      title: 'Error',
      message: 'Error al cargar el perfil',
      user: req.user
    });
  }
};

/**
 * Cambiar contraseña desde el perfil
 */
export const changePassword = async (req, res) => {
  try {
    const { current_password, new_password, confirm_password } = req.body;
    const userId = req.user._id;

    // Validaciones
    if (!current_password || !new_password || !confirm_password) {
      req.flash('error', 'Todos los campos son requeridos');
      return res.redirect('/profile');
    }

    if (new_password !== confirm_password) {
      req.flash('error', 'Las contraseñas nuevas no coinciden');
      return res.redirect('/profile');
    }

    if (new_password.length < 6) {
      req.flash('error', 'La nueva contraseña debe tener al menos 6 caracteres');
      return res.redirect('/profile');
    }

    // Obtener usuario con password
    const user = await UserModel.model.findById(userId);

    if (!user) {
      req.flash('error', 'Usuario no encontrado');
      return res.redirect('/profile');
    }

    // Verificar contraseña actual
    const isMatch = await user.comparePassword(current_password);
    if (!isMatch) {
      req.flash('error', 'La contraseña actual es incorrecta');
      return res.redirect('/profile');
    }

    // Actualizar contraseña (se hasheará automáticamente por el hook pre-save)
    user.password_hash = new_password;
    await user.save();

    req.flash('success', 'Contraseña actualizada exitosamente');
    res.redirect('/profile');
  } catch (error) {
    console.error('Error al cambiar contraseña:', error);
    req.flash('error', 'Error al cambiar la contraseña. Intenta nuevamente.');
    res.redirect('/profile');
  }
};

export default {
  showLogin,
  processLogin,
  logout,
  showRegister,
  register,
  showDashboard,
  showProfile,
  changePassword
};
