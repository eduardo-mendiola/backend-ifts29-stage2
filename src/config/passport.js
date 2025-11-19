import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import UserModel from '../models/UserModel.js';
import EmployeeModel from '../models/EmployeeModel.js';

// Estrategia Local para login con username y password
passport.use(new LocalStrategy(
  {
    usernameField: 'email', // Usar email como campo de usuario
    passwordField: 'password'
  },
  async (email, password, done) => {
    try {
      console.log('[AUTH] Intentando login con:', email);
      
      // Buscar usuario por email o username
      const user = await UserModel.model.findOne({ 
        $or: [{ email }, { username: email }] 
      }).populate('role_id');
      
      if (!user) {
        console.log('[AUTH] Usuario no encontrado:', email);
        return done(null, false, { message: 'Usuario o contraseña incorrectos' });
      }

      // Verificar contraseña
      const isMatch = await user.comparePassword(password);
      
      if (!isMatch) {
        console.log('[AUTH] Contraseña incorrecta para:', email);
        return done(null, false, { message: 'Usuario o contraseña incorrectos' });
      }

      // Verificar si está activo
      if (!user.is_active) {
        console.log('[AUTH] Usuario inactivo:', email);
        return done(null, false, { message: 'Tu cuenta está inactiva. Contacta al administrador.' });
      }

      console.log('[AUTH] Login exitoso para:', email);
      
      // Actualizar último login
      await UserModel.updateLastLogin(user._id);

      return done(null, user);
    } catch (error) {
      console.error('[AUTH] Error en autenticación:', error);
      return done(null, false, { message: 'Error al iniciar sesión. Intenta nuevamente.' });
    }
  }
));

// Serialización - Guardar solo el ID en la sesión
passport.serializeUser((user, done) => {
  console.log('[AUTH] Serializando usuario:', user._id);
  done(null, user._id);
});

// Deserialización - Recuperar el usuario completo desde el ID
passport.deserializeUser(async (id, done) => {
  try {
    console.log('[AUTH] Deserializando usuario:', id);
    
    const user = await UserModel.model.findById(id)
      .populate('role_id')
      .select('-password_hash');
    
    // Buscar el empleado asociado al usuario
    const employee = await EmployeeModel.model.findOne({ user_id: id })
      .select('first_name last_name');
    
    // Convertir a objeto plano y agregar el empleado si existe
    const userObj = user.toObject();
    if (employee) {
      userObj.employee = employee.toObject();
    }
    
    done(null, userObj);
  } catch (error) {
    console.error('[AUTH] Error en deserialización:', error);
    done(error);
  }
});

export default passport;
