import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Role from './src/models/RoleModel.js';
import { allPermissions } from './src/config/permissions.js';

dotenv.config();

async function updateRolesWithPermissions() {
  try {
    await mongoose.connect(process.env.MONGO_URI_ATLAS);
    console.log('✅ Conectado a MongoDB');

    // Obtener todos los roles existentes
    const allRoles = await Role.findAll();

    // Crear o actualizar rol de Administrador con todos los permisos
    let adminRole = allRoles.find(r => r.name === 'Administrador');
    if (adminRole) {
      await Role.update(adminRole._id, { permissions: allPermissions });
      console.log('✅ Rol Administrador actualizado con todos los permisos');
    } else {
      await Role.create({
        name: 'Administrador',
        description: 'Acceso completo a todas las funcionalidades del sistema',
        permissions: allPermissions,
        is_active: true
      });
      console.log('✅ Rol Administrador creado con todos los permisos');
    }

    // Refrescar la lista de roles
    const updatedRoles = await Role.findAll();

    // Crear rol de Empleado con permisos limitados
    let employeeRole = updatedRoles.find(r => r.name === 'Empleado');
    const employeePermissions = [
      'view_dashboard',
      'view_projects',
      'view_tasks',
      'edit_tasks',
      'view_time_entries',
      'create_time_entries',
      'edit_time_entries',
      'view_document_files',
      'view_clients',
      'view_contacts'
    ];

    if (employeeRole) {
      await Role.update(employeeRole._id, { permissions: employeePermissions });
      console.log('✅ Rol Empleado actualizado');
    } else {
      await Role.create({
        name: 'Empleado',
        description: 'Acceso limitado a proyectos y tareas asignadas',
        permissions: employeePermissions,
        is_active: true
      });
      console.log('✅ Rol Empleado creado');
    }

    // Refrescar la lista de roles
    const roles2 = await Role.findAll();

    // Crear rol de Gerente de Proyecto
    let managerRole = roles2.find(r => r.name === 'Gerente de Proyecto');
    const managerPermissions = [
      'view_dashboard',
      'view_projects',
      'edit_projects',
      'create_tasks',
      'view_tasks',
      'edit_tasks',
      'delete_tasks',
      'view_time_entries',
      'create_time_entries',
      'edit_time_entries',
      'view_document_files',
      'create_document_files',
      'edit_document_files',
      'view_clients',
      'view_contacts',
      'view_employees',
      'view_teams',
      'view_estimates',
      'create_estimates',
      'edit_estimates'
    ];

    if (managerRole) {
      await Role.update(managerRole._id, { permissions: managerPermissions });
      console.log('✅ Rol Gerente de Proyecto actualizado');
    } else {
      await Role.create({
        name: 'Gerente de Proyecto',
        description: 'Gestión de proyectos, tareas y equipos',
        permissions: managerPermissions,
        is_active: true
      });
      console.log('✅ Rol Gerente de Proyecto creado');
    }

    // Refrescar la lista de roles
    const roles3 = await Role.findAll();

    // Crear rol de Contador
    let accountantRole = roles3.find(r => r.name === 'Contador');
    const accountantPermissions = [
      'view_dashboard',
      'view_clients',
      'view_projects',
      'create_invoices',
      'view_invoices',
      'edit_invoices',
      'delete_invoices',
      'create_payments',
      'view_payments',
      'edit_payments',
      'delete_payments',
      'create_receipts',
      'view_receipts',
      'edit_receipts',
      'delete_receipts',
      'create_expenses',
      'view_expenses',
      'edit_expenses',
      'delete_expenses',
      'view_expense_categories',
      'create_estimates',
      'view_estimates',
      'edit_estimates'
    ];

    if (accountantRole) {
      await Role.update(accountantRole._id, { permissions: accountantPermissions });
      console.log('✅ Rol Contador actualizado');
    } else {
      await Role.create({
        code: 'ROL-CONT',
        name: 'Contador',
        description: 'Gestión de facturación, pagos y gastos',
        permissions: accountantPermissions,
        is_active: true
      });
      console.log('✅ Rol Contador creado');
    }

    console.log('\n📊 Resumen de permisos disponibles:');
    console.log(`Total de permisos en el sistema: ${allPermissions.length}`);
    
    const finalRoles = await Role.findAll();
    const activeRoles = finalRoles.filter(r => r.is_active);
    console.log(`\nRoles activos: ${activeRoles.length}`);
    for (const role of activeRoles) {
      console.log(`  - ${role.name}: ${(role.permissions || []).length} permisos`);
    }

    console.log('\n✅ Actualización de roles completada exitosamente');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

updateRolesWithPermissions();
