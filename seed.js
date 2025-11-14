import 'dotenv/config';
import mongoose from 'mongoose';
import UserModel from './src/models/UserModel.js';
import RoleModel from './src/models/RoleModel.js';

/**
 * Script de inicialización para crear roles y usuario administrador
 * Ejecutar con: node seed.js
 */

async function seedDatabase() {
  try {
    // Conectar a MongoDB
    await mongoose.connect(process.env.MONGO_URI_ATLAS);
    console.log('Conectado a MongoDB');

    // Crear roles por defecto
    const roles = [
      { 
        code: 'ROL-001', 
        name: 'admin', 
        description: 'Administrador del sistema con acceso completo', 
        permissions: [
          'view_users',
          'edit_users',
          'create_users',
          'delete_users',
          'view_projects',
          'edit_projects',
          'create_projects',
          'delete_projects',
          'view_tasks',
          'edit_tasks',
          'create_tasks',
          'delete_tasks',
          'log_time',
          'view_reports',
          'manage_roles',
        ] 
      },
      { code: 'ROL-002', 
        name: 'manager', 
        description: 'Gerente con permisos de gestión', 
        permissions: [
          'view_users',
          'edit_users',
          'create_users',
          'delete_users',
          'view_projects',
          'edit_projects',
          'create_projects',
          'delete_projects',
          'view_tasks',
          'edit_tasks',
          'create_tasks',
          'delete_tasks',
          'log_time',
          'view_reports',
          'manage_roles',
        ] 
      },
      { 
        code: 'ROL-003', 
        name: 'user', 
        description: 'Usuario estándar con permisos básicos', 
        permissions: [
          'view_users',
          'view_projects',
          'view_tasks',
          'log_time',
          'view_reports',
        ] 
      }
    ];

    console.log('\nCreando roles...');
    for (const roleData of roles) {
      const existingRole = await RoleModel.model.findOne({ name: roleData.name });
      if (!existingRole) {
        await RoleModel.create(roleData);
        console.log(`   - Rol creado: ${roleData.name}`);
      } else {
        console.log(`   - Rol ya existe: ${roleData.name}`);
      }
    }

    // Crear usuario administrador
    const adminRole = await RoleModel.model.findOne({ name: 'admin' });
    const existingAdmin = await UserModel.model.findOne({ username: 'admin' });

    if (!existingAdmin) {
      console.log('\nCreando usuario administrador...');
      
      const adminUser = new UserModel.model({
        code: 'USR-0001',
        username: 'admin',
        email: 'admin@clickwave.com',
        password_hash: 'admin123', // Se hasheará automáticamente
        role_id: adminRole._id,
        is_active: true
      });

      await adminUser.save();
      console.log('   Usuario administrador creado exitosamente');
      console.log('   Email: admin@clickwave.com');
      console.log('   Password: admin123');
      console.log('   IMPORTANTE: Cambia esta contraseña después del primer login');
    } else {
      console.log('\n   - Usuario administrador ya existe');
    }

    // Crear usuario de prueba
    const userRole = await RoleModel.model.findOne({ name: 'user' });
    const existingTestUser = await UserModel.model.findOne({ username: 'testuser' });

    if (!existingTestUser) {
      console.log('\nCreando usuario de prueba...');
      
      const testUser = new UserModel.model({
        code: 'USR-0002',
        username: 'testuser',
        email: 'test@clickwave.com',
        password_hash: 'test123', // Se hasheará automáticamente
        role_id: userRole._id,
        is_active: true
      });

      await testUser.save();
      console.log('   Usuario de prueba creado exitosamente');
      console.log('   Email: test@clickwave.com');
      console.log('   Password: test123');
    } else {
      console.log('\n   - Usuario de prueba ya existe');
    }

    console.log('\nInicialización completada exitosamente\n');
  } catch (error) {
    console.error('Error en inicialización:', error);
  } finally {
    await mongoose.connection.close();
    console.log('Desconectado de MongoDB');
    process.exit(0);
  }
}

// Ejecutar seed
seedDatabase();
