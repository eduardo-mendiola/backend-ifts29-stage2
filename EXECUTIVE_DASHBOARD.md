# Dashboard Ejecutivo - NexusFlow

## 📊 Descripción

El Dashboard Ejecutivo es una interfaz completa diseñada para usuarios con permisos ejecutivos que necesitan visualizar métricas de negocio, análisis financiero y reportes en tiempo real.

## ✨ Características

### Métricas Principales
- **Facturación Total del Mes**: Monto total facturado en el período seleccionado
- **Facturación Promedio Diaria**: Promedio de ingresos por día
- **Facturas Pagadas**: Cantidad y monto de facturas cobradas
- **Facturas Impagas**: Cantidad y monto pendiente de cobro
- **Porcentaje de Cobranzas**: Ratio de facturación cobrada vs total
- **Variación Mensual**: Comparación con el período anterior

### Gráficos Visuales
- **Facturación por Semana**: Gráfico de barras con evolución semanal
- **Evolución Mensual**: Gráfico de líneas con los últimos 6 meses
- **Distribución por Estado**: Gráfico de dona con estados de facturas
- **Proyectos Activos**: Gráfico polar con distribución de proyectos

### Listados
- **Top 5 Clientes**: Clientes con mayor facturación en el período
- **Últimas 10 Facturas**: Tabla con las facturas más recientes
- **Resumen Rápido**: Totales de clientes, proyectos y tareas

### Selectores de Período
- Mes actual
- Mes anterior
- Último trimestre
- Año actual

## 🚀 Instalación y Configuración

### 1. Crear Rol Ejecutivo

Ejecutar el script para crear el rol ejecutivo con todos los permisos necesarios:

```bash
node create-executive-role.js
```

Este script:
- ✅ Crea o actualiza el rol "executive"
- ✅ Asigna todos los permisos de dashboard y reportes
- ✅ Configura permisos de solo lectura para módulos operativos
- ✅ Muestra un resumen de permisos asignados

### 2. Asignar Rol a Usuario

1. Acceder al sistema como administrador
2. Ir a **Usuarios** (`/users`)
3. Seleccionar el usuario que será ejecutivo
4. Click en **Editar**
5. En el campo "Rol", seleccionar **executive**
6. Guardar cambios

### 3. Acceder al Dashboard

1. Iniciar sesión con un usuario que tenga rol ejecutivo
2. En el sidebar, hacer click en **Dashboard Ejecutivo**
3. El dashboard cargará automáticamente los datos del mes actual

## 📁 Archivos Creados

### Controlador
```
src/controllers/ExecutiveDashboardController.js
```
- Gestiona la lógica del dashboard
- Calcula métricas y estadísticas
- Provee datos para los gráficos
- API endpoint para cargar datos dinámicamente

### Vista
```
views/executive-dashboard.pug
```
- Template Pug con diseño responsivo
- Tarjetas de métricas con iconos
- Gráficos con Chart.js
- Tabla de facturas recientes
- Scripts JavaScript para interactividad

### Permisos
```
src/config/permissions.js
```
Permisos agregados:
- `view_executive_dashboard`
- `view_financial_reports`
- `view_client_reports`
- `view_project_reports`
- `view_revenue_analysis`
- `view_profitability_analysis`
- `export_reports`
- `view_all_invoices`
- `view_all_payments`
- `view_all_receipts`

### Rutas
```
src/app.js
```
Rutas agregadas:
- `GET /executive-dashboard` - Vista del dashboard
- `GET /api/executive-dashboard` - API con datos JSON

### Scripts
```
create-executive-role.js
```
Script para crear/actualizar el rol ejecutivo

## 🎨 Diseño y UI

### Colores por Métrica
- **Facturación Total**: Azul primario (`border-primary`)
- **Promedio Diario**: Azul info (`border-info`)
- **Facturas Pagadas**: Verde (`border-success`)
- **Facturas Impagas**: Amarillo (`border-warning`)
- **% Cobranzas**: Azul primario (`border-primary`)
- **Variación**: Gris (`border-secondary`)

### Responsividad
- **Desktop (XL)**: 6 tarjetas en fila
- **Tablet (LG)**: 4 tarjetas en fila
- **Mobile (SM)**: 2 tarjetas en fila

### Gráficos
- **Chart.js 4.4.0**: Biblioteca de gráficos moderna
- **Tema oscuro**: Coordinado con el sistema
- **Interactivos**: Tooltips y animaciones

## 🔧 Personalización

### Agregar Nuevas Métricas

1. Actualizar `ExecutiveDashboardController.js`:
```javascript
async getMetrics(dateRange) {
  // ... código existente ...
  
  // Nueva métrica
  const newMetric = await calculateNewMetric();
  
  return {
    // ... métricas existentes ...
    newMetric
  };
}
```

2. Actualizar `executive-dashboard.pug`:
```pug
.col-12.col-sm-6.col-lg-4.col-xl-2
  .card.bg-dark.border-primary.h-100
    .card-body
      div
        p.text-muted.mb-1.small Nueva Métrica
        h3.mb-0#newMetric 0
```

3. Actualizar JavaScript en la vista:
```javascript
function updateMetrics(metrics) {
  // ... código existente ...
  document.getElementById('newMetric').textContent = metrics.newMetric;
}
```

### Modificar Períodos

Editar el selector en `executive-dashboard.pug`:
```pug
select#periodSelector.form-select
  option(value="current") Mes actual
  option(value="custom") Período personalizado
```

Actualizar `getDateRange()` en el controlador:
```javascript
getDateRange(period) {
  // ... casos existentes ...
  case 'custom':
    // Lógica personalizada
    break;
}
```

## 📊 API Endpoints

### GET /api/executive-dashboard

**Query Parameters:**
- `period` (opcional): `current`, `last`, `quarter`, `year`

**Response:**
```json
{
  "metrics": {
    "totalRevenue": 150000.50,
    "avgDaily": 5000.02,
    "paidCount": 25,
    "paidAmount": 120000.00,
    "unpaidCount": 5,
    "unpaidAmount": 30000.50,
    "collectionRate": 80.0,
    "monthlyVariation": 15.5
  },
  "charts": {
    "weekly": {
      "labels": ["Sem 1", "Sem 2", "Sem 3", "Sem 4"],
      "data": [30000, 35000, 40000, 45000]
    },
    "monthly": {
      "labels": ["Jun", "Jul", "Ago", "Sep", "Oct", "Nov"],
      "data": [100000, 110000, 120000, 130000, 140000, 150000]
    },
    "status": {
      "data": [25, 5, 2]
    },
    "projects": {
      "data": [10, 15, 3]
    }
  },
  "recentInvoices": [...],
  "topClients": [...],
  "summary": {
    "totalClients": 45,
    "activeProjects": 10,
    "pendingTasks": 28
  }
}
```

## 🔐 Seguridad

### Permisos Requeridos
- Usuario debe estar autenticado (`isAuthenticated`)
- Usuario debe tener permiso `view_executive_dashboard`

### Validaciones
- Todas las rutas protegidas con middleware
- Datos filtrados según permisos del usuario
- Queries seguras con Mongoose

## 🐛 Troubleshooting

### El dashboard no carga datos

1. Verificar que el usuario tiene el rol ejecutivo
2. Revisar la consola del navegador para errores
3. Verificar que existen facturas en la base de datos
4. Comprobar conexión a MongoDB

### Gráficos no se muestran

1. Verificar que Chart.js se carga correctamente
2. Revisar errores en la consola del navegador
3. Verificar que los elementos canvas existen en el DOM

### Permisos insuficientes

1. Ejecutar `node create-executive-role.js`
2. Verificar que el usuario tiene el rol correcto
3. Cerrar sesión y volver a iniciar

## 📈 Mejoras Futuras

- [ ] Exportar reportes a PDF
- [ ] Filtros por fecha personalizados
- [ ] Comparación entre períodos
- [ ] Gráficos de gastos vs ingresos
- [ ] Proyecciones de facturación
- [ ] Alertas de facturas vencidas
- [ ] Dashboard por cliente
- [ ] Métricas de rentabilidad por proyecto

## 👥 Soporte

Para dudas o problemas:
1. Revisar este README
2. Consultar documentación de permisos en `PROTECT_API_ROUTES.md`
3. Verificar logs del servidor
4. Contactar al equipo de desarrollo

---

**Última actualización**: Noviembre 2025  
**Versión**: 1.0.0  
**Autor**: NexusFlow Development Team
