import UserModel from '../models/UserModel.js';
import { generateToken } from '../config/jwtMiddleware.js';

/**
 * ApiController - Manejo de autenticación y operaciones para API REST con JWT
 */

/**
 * Login API - Devuelve token JWT
 * POST /api/auth/login
 */
export const loginAPI = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validación de entrada
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email y contraseña son requeridos'
      });
    }

    // Buscar usuario por email o username
    const user = await UserModel.model.findOne({ 
      $or: [{ email }, { username: email }] 
    }).populate('role_id');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Credenciales inválidas'
      });
    }

    // Verificar contraseña
    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Credenciales inválidas'
      });
    }

    // Verificar si está activo
    if (!user.is_active) {
      return res.status(401).json({
        success: false,
        message: 'Usuario inactivo. Contacta al administrador.'
      });
    }

    // Actualizar último login
    await UserModel.updateLastLogin(user._id);

    // Generar token JWT
    const token = generateToken(user._id);

    // Respuesta exitosa
    res.json({
      success: true,
      message: 'Login exitoso',
      token,
      user: {
        id: user._id,
        code: user.code,
        username: user.username,
        email: user.email,
        role: user.role_id?.name,
        is_active: user.is_active
      }
    });
  } catch (error) {
    console.error('Error en login API:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

/**
 * Registro API - Crea nuevo usuario y devuelve token
 * POST /api/auth/register
 */
export const registerAPI = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Validaciones
    if (!username || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Todos los campos son requeridos'
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'La contraseña debe tener al menos 6 caracteres'
      });
    }

    // Verificar si existe
    const existingUser = await UserModel.model.findOne({ 
      $or: [{ username }, { email }] 
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'El usuario o email ya está registrado'
      });
    }

    // Obtener rol por defecto
    const RoleModel = (await import('../models/RoleModel.js')).default;
    let defaultRole = await RoleModel.model.findOne({ name: 'user' });
    
    if (!defaultRole) {
      defaultRole = await RoleModel.create({
        name: 'user',
        description: 'Usuario estándar'
      });
    }

    // Generar código
    const userCount = await UserModel.model.countDocuments();
    const code = `USR-${String(userCount + 1).padStart(4, '0')}`;

    // Crear usuario
    const newUser = new UserModel.model({
      code,
      username,
      email,
      password_hash: password,
      role_id: defaultRole._id,
      is_active: true
    });

    await newUser.save();

    // Generar token
    const token = generateToken(newUser._id);

    res.status(201).json({
      success: true,
      message: 'Usuario registrado exitosamente',
      token,
      user: {
        id: newUser._id,
        code: newUser.code,
        username: newUser.username,
        email: newUser.email,
        role: defaultRole.name
      }
    });
  } catch (error) {
    console.error('Error en registro API:', error);
    res.status(500).json({
      success: false,
      message: 'Error al registrar usuario'
    });
  }
};

/**
 * Obtener perfil del usuario autenticado
 * GET /api/auth/profile
 * Requiere: JWT token
 */
export const getProfile = async (req, res) => {
  try {
    // req.user ya está disponible gracias al middleware requireToken
    const user = await UserModel.model.findById(req.user._id)
      .populate('role_id')
      .select('-password_hash');

    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    console.error('Error al obtener perfil:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener perfil'
    });
  }
};

/**
 * Actualizar perfil del usuario autenticado
 * PUT /api/auth/profile
 * Requiere: JWT token
 */
export const updateProfile = async (req, res) => {
  try {
    const { username, email } = req.body;
    const userId = req.user._id;

    // Verificar si username/email ya existen (excepto el usuario actual)
    if (username || email) {
      const query = { _id: { $ne: userId } };
      if (username) query.username = username;
      if (email) query.email = email;

      const existing = await UserModel.model.findOne(query);
      if (existing) {
        return res.status(400).json({
          success: false,
          message: 'El username o email ya está en uso'
        });
      }
    }

    // Actualizar usuario
    const updateData = {};
    if (username) updateData.username = username;
    if (email) updateData.email = email;

    const updatedUser = await UserModel.model.findByIdAndUpdate(
      userId,
      updateData,
      { new: true, runValidators: true }
    ).populate('role_id').select('-password_hash');

    res.json({
      success: true,
      message: 'Perfil actualizado exitosamente',
      data: updatedUser
    });
  } catch (error) {
    console.error('Error al actualizar perfil:', error);
    res.status(500).json({
      success: false,
      message: 'Error al actualizar perfil'
    });
  }
};

/**
 * Cambiar contraseña
 * PUT /api/auth/change-password
 * Requiere: JWT token
 */
export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user._id;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Contraseña actual y nueva son requeridas'
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'La nueva contraseña debe tener al menos 6 caracteres'
      });
    }

    // Obtener usuario con password
    const user = await UserModel.model.findById(userId);

    // Verificar contraseña actual
    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Contraseña actual incorrecta'
      });
    }

    // Actualizar contraseña
    user.password_hash = newPassword;
    await user.save();

    res.json({
      success: true,
      message: 'Contraseña actualizada exitosamente'
    });
  } catch (error) {
    console.error('Error al cambiar contraseña:', error);
    res.status(500).json({
      success: false,
      message: 'Error al cambiar contraseña'
    });
  }
};

/**
 * Validar token (útil para verificar si el token sigue válido)
 * GET /api/auth/validate
 * Requiere: JWT token
 */
export const validateToken = (req, res) => {
  // Si llegó aquí, el token es válido (gracias al middleware)
  res.json({
    success: true,
    message: 'Token válido',
    user: {
      id: req.user._id,
      username: req.user.username,
      email: req.user.email,
      role: req.user.role_id?.name
    }
  });
};

export default {
  loginAPI,
  registerAPI,
  getProfile,
  updateProfile,
  changePassword,
  validateToken
};
