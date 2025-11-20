import mongoose from 'mongoose';
import dotenv from 'dotenv';
import RoleModel from './src/models/RoleModel.js';

dotenv.config();

/**
 * Script para crear o actualizar el rol ejecutivo con permisos de dashboard y reportes
 */

// Permisos ejecutivos completos
const executivePermissions = [
  // Dashboards
  'view_dashboard',
  'view_executive_dashboard',
  
  // Reportes
  'view_financial_reports',
  'view_client_reports',
  'view_project_reports',
  
  // Análisis
  'view_revenue_analysis',
  'view_profitability_analysis',
  'export_reports',
  
  // Vista completa de módulos financieros
  'view_all_invoices',
  'view_invoices',
  'view_all_payments',
  'view_payments',
  'view_all_receipts',
  'view_receipts',
  'view_estimates',
  'view_expenses',
  'view_expense_categories',
  
  // Lectura de información operativa
  'view_clients',
  'view_contacts',
  'view_projects',
  'view_tasks',
  'view_time_entries',
  'view_employees',
  'view_users',
  'view_areas',
  'view_positions',
  'view_teams',
  'view_team_roles',
  'view_document_files'
];

async function createOrUpdateExecutiveRole() {
  try {
    const mongoUri = process.env.MONGO_URI_ATLAS || process.env.MONGO_URI_TEST || 'mongodb://localhost:27017/clickwavedb';
    console.log('🔗 Conectando a:', mongoUri.includes('mongodb+srv') ? 'MongoDB Atlas' : 'MongoDB Local');
    
    await mongoose.connect(mongoUri);
    console.log('✅ Conectado a MongoDB');

    // Buscar si existe el rol ejecutivo
    let executiveRole = await RoleModel.model.findOne({ name: 'executive' });

    if (!executiveRole) {
      // Crear nuevo rol ejecutivo
      executiveRole = await RoleModel.model.create({
        code: 'EXEC-001',
        name: 'executive',
        description: 'Rol ejecutivo con acceso completo a dashboards, reportes y análisis. Solo lectura en módulos operativos.',
        permissions: executivePermissions
      });
      console.log('✅ Rol ejecutivo creado exitosamente');
    } else {
      // Actualizar permisos del rol ejecutivo existente
      executiveRole.permissions = [
        ...new Set([...executiveRole.permissions, ...executivePermissions])
      ];
      executiveRole.description = 'Rol ejecutivo con acceso completo a dashboards, reportes y análisis. Solo lectura en módulos operativos.';
      await executiveRole.save();
      console.log('✅ Rol ejecutivo actualizado exitosamente');
    }

    console.log('\n📋 Permisos del rol ejecutivo:');
    console.log('━'.repeat(60));
    
    console.log('\n🎯 DASHBOARDS:');
    executivePermissions.filter(p => p.includes('dashboard')).forEach(p => {
      console.log(`  ✓ ${p}`);
    });
    
    console.log('\n📊 REPORTES Y ANÁLISIS:');
    executivePermissions.filter(p => 
      p.includes('report') || p.includes('analysis') || p === 'export_reports'
    ).forEach(p => {
      console.log(`  ✓ ${p}`);
    });
    
    console.log('\n💰 MÓDULOS FINANCIEROS:');
    executivePermissions.filter(p => 
      p.includes('invoice') || p.includes('payment') || 
      p.includes('receipt') || p.includes('estimate') || p.includes('expense')
    ).forEach(p => {
      console.log(`  ✓ ${p}`);
    });
    
    console.log('\n👥 MÓDULOS OPERATIVOS (Solo lectura):');
    executivePermissions.filter(p => 
      p.includes('client') || p.includes('contact') || p.includes('project') || 
      p.includes('task') || p.includes('time_entry') || p.includes('employee') || 
      p.includes('user') || p.includes('area') || p.includes('position') || 
      p.includes('team') || p.includes('document')
    ).forEach(p => {
      console.log(`  ✓ ${p}`);
    });
    
    console.log('\n━'.repeat(60));
    console.log(`\n📌 Total de permisos: ${executiveRole.permissions.length}`);
    console.log(`📌 ID del rol: ${executiveRole._id}`);
    console.log(`📌 Código: ${executiveRole.code}`);
    console.log('\n✨ Para asignar este rol a un usuario, edita el usuario desde /users/{id}/edit');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

createOrUpdateExecutiveRole();
