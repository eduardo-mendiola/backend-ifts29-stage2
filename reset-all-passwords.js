import 'dotenv/config';
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

/**
 * Script para resetear contraseñas de TODOS los usuarios
 * Todos los usuarios tendrán la contraseña: user123
 */

const resetAllPasswords = async () => {
  try {
    const defaultPassword = 'user123';

    // Conectar a MongoDB
    await mongoose.connect(process.env.MONGO_URI_ATLAS);
    console.log('✅ Conectado a MongoDB\n');

    // Definir el esquema para poder buscar
    const userSchema = new mongoose.Schema({}, { collection: 'users', strict: false });
    const User = mongoose.model('User', userSchema);
    
    // Obtener todos los usuarios
    const users = await User.find({});
    
    console.log(`📋 Total de usuarios encontrados: ${users.length}\n`);
    
    if (users.length === 0) {
      console.log('⚠️  No se encontraron usuarios en la base de datos');
      console.log('   Ejecuta primero: node seed.js');
      await mongoose.disconnect();
      process.exit(0);
    }

    console.log(`📋 Se encontraron ${users.length} usuarios\n`);
    console.log(`🔄 Reseteando todas las contraseñas a: ${defaultPassword}\n`);

    // Hashear la contraseña una sola vez
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(defaultPassword, salt);

    // Actualizar todos los usuarios
    let count = 0;
    for (const user of users) {
      await User.findByIdAndUpdate(user._id, {
        password_hash: hashedPassword
      });
      
      count++;
      console.log(`   ✓ ${count}. ${user.email} - contraseña reseteada`);
    }

    console.log(`\n✅ Se resetearon ${count} contraseñas exitosamente`);
    console.log(`   Contraseña para todos: ${defaultPassword}\n`);

    await mongoose.disconnect();
    console.log('✅ Desconectado de MongoDB');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    await mongoose.disconnect();
    process.exit(1);
  }
};

resetAllPasswords();
