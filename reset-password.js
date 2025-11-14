import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import UserModel from './src/models/UserModel.js';

/**
 * Script para resetear contraseña de un usuario específico
 * Uso: node reset-password.js <email> <nueva_contraseña>
 */

const resetPassword = async () => {
  try {
    // Obtener argumentos
    const [,, email, newPassword] = process.argv;

    if (!email || !newPassword) {
      console.error('❌ Uso: node reset-password.js <email> <nueva_contraseña>');
      console.error('   Ejemplo: node reset-password.js usuario@ejemplo.com mi_nueva_pass');
      process.exit(1);
    }

    // Conectar a MongoDB
    await mongoose.connect('mongodb://localhost:27017/ClickWave', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('✅ Conectado a MongoDB\n');

    // Buscar usuario
    const user = await UserModel.model.findOne({ email });

    if (!user) {
      console.error(`❌ No se encontró ningún usuario con el email: ${email}`);
      await mongoose.disconnect();
      process.exit(1);
    }

    console.log(`👤 Usuario encontrado: ${user.username} (${user.email})`);
    console.log(`🔄 Reseteando contraseña...`);

    // Hashear nueva contraseña
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Actualizar directamente con findByIdAndUpdate para evitar el pre-save hook
    await UserModel.model.findByIdAndUpdate(user._id, {
      password_hash: hashedPassword
    });

    console.log(`✅ Contraseña actualizada exitosamente para ${user.email}`);
    console.log(`   Nueva contraseña: ${newPassword}\n`);

    await mongoose.disconnect();
    console.log('✅ Desconectado de MongoDB');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    await mongoose.disconnect();
    process.exit(1);
  }
};

resetPassword();
