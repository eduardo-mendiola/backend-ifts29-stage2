import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import UserModel from '../models/UserModel.js';

// Estrategia Local para login con username y password
passport.use(new LocalStrategy(
  {
    usernameField: 'email', // Usar email como campo de usuario
    passwordField: 'password'
  },
  async (email, password, done) => {
    try {
      // Buscar usuario por email o username
      const user = await UserModel.model.findOne({ 
        $or: [{ email }, { username: email }] 
      }).populate('role_id');
      
      if (!user) {
        return done(null, false, { message: 'Usuario o contraseña incorrectos' });
      }

      // Verificar contraseña
      const isMatch = await user.comparePassword(password);
      
      if (!isMatch) {
        return done(null, false, { message: 'Usuario o contraseña incorrectos' });
      }

      // Verificar si está activo
      if (!user.is_active) {
        return done(null, false, { message: 'Tu cuenta está inactiva. Contacta al administrador.' });
      }

      // Actualizar último login
      await UserModel.updateLastLogin(user._id);

      return done(null, user);
    } catch (error) {
      console.error('Error en autenticación:', error);
      return done(null, false, { message: 'Error al iniciar sesión. Intenta nuevamente.' });
    }
  }
));

// Serialización - Guardar solo el ID en la sesión
passport.serializeUser((user, done) => {
  done(null, user._id);
});

// Deserialización - Recuperar el usuario completo desde el ID
passport.deserializeUser(async (id, done) => {
  try {
    const user = await UserModel.model.findById(id)
      .populate('role_id')
      .select('-password_hash');
    done(null, user);
  } catch (error) {
    console.error('Error en deserialización:', error);
    done(error);
  }
});

export default passport;
