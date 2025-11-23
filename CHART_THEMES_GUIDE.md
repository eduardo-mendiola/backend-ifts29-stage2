# Guía de Uso: Integración de Gráficos con Temas

## Para Desarrolladores

Si estás creando o modificando páginas con gráficos Chart.js, sigue estos pasos para que soporten el cambio de tema:

### 1. Incluir el script de temas en tu página

Agrega esta línea en el `<head>` o antes de tu script de gráficos:

```pug
script(src="/js/chart-themes.js")
```

### 2. Crear gráficos con soporte de temas

#### Opción A: Usar `getChartThemeOptions()` (Recomendado)

```javascript
const ctx = document.getElementById('myChart').getContext('2d');

const myChart = new Chart(ctx, {
  type: 'bar',
  data: {
    labels: ['Enero', 'Febrero', 'Marzo'],
    datasets: [{
      label: 'Ventas',
      data: [12, 19, 3],
      backgroundColor: 'rgba(54, 162, 235, 0.5)'
    }]
  },
  options: getChartThemeOptions({
    // Tus opciones personalizadas aquí
    plugins: {
      title: {
        display: true,
        text: 'Ventas Mensuales'
      }
    }
  })
});

// Guardar la instancia para actualizaciones automáticas
if (!window.chartInstances) window.chartInstances = [];
window.chartInstances.push(myChart);
```

#### Opción B: Obtener solo los colores

```javascript
const colors = getChartThemeColors();

const myChart = new Chart(ctx, {
  type: 'line',
  data: { /* ... */ },
  options: {
    scales: {
      x: {
        ticks: { color: colors.textColor },
        grid: { color: colors.gridColor }
      },
      y: {
        ticks: { color: colors.textColor },
        grid: { color: colors.gridColor }
      }
    }
  }
});
```

### 3. Registrar gráficos para actualización automática

Para que los gráficos se actualicen automáticamente al cambiar el tema:

```javascript
// Después de crear cada gráfico
if (!window.chartInstances) window.chartInstances = [];
window.chartInstances.push(myChart);
```

### 4. Actualización manual (opcional)

Si necesitas actualizar un gráfico manualmente:

```javascript
updateChartTheme(myChart);
```

## Colores Disponibles

### Tema Oscuro
- Grid: `#444444`
- Texto: `#f0f0f0`
- Fondo: `rgba(255, 255, 255, 0.05)`
- Tooltip fondo: `#2a2a2a`

### Tema Claro
- Grid: `#e0e0e0`
- Texto: `#333333`
- Fondo: `rgba(0, 0, 0, 0.05)`
- Tooltip fondo: `#ffffff`

## Ejemplo Completo

```pug
extends layout.pug

block content
  .container-fluid
    h2 Dashboard con Gráficos
    
    .row
      .col-md-6
        canvas#salesChart
      .col-md-6
        canvas#revenueChart

  script(src="https://cdn.jsdelivr.net/npm/chart.js")
  script(src="/js/chart-themes.js")
  script.
    document.addEventListener('DOMContentLoaded', () => {
      // Gráfico de ventas
      const salesChart = new Chart(
        document.getElementById('salesChart'),
        {
          type: 'bar',
          data: {
            labels: ['Ene', 'Feb', 'Mar', 'Abr'],
            datasets: [{
              label: 'Ventas',
              data: [65, 59, 80, 81],
              backgroundColor: 'rgba(75, 192, 192, 0.5)'
            }]
          },
          options: getChartThemeOptions()
        }
      );
      
      // Gráfico de ingresos
      const revenueChart = new Chart(
        document.getElementById('revenueChart'),
        {
          type: 'line',
          data: {
            labels: ['Ene', 'Feb', 'Mar', 'Abr'],
            datasets: [{
              label: 'Ingresos',
              data: [28, 48, 40, 19],
              borderColor: 'rgb(255, 99, 132)',
              backgroundColor: 'rgba(255, 99, 132, 0.1)'
            }]
          },
          options: getChartThemeOptions()
        }
      );
      
      // Registrar para actualización automática
      window.chartInstances = [salesChart, revenueChart];
    });
```

## Notas Importantes

1. **Siempre incluye `chart-themes.js`** antes de crear tus gráficos
2. **Registra los gráficos** en `window.chartInstances` para actualización automática
3. **Usa `getChartThemeOptions()`** para configuración consistente
4. Los gráficos se actualizarán automáticamente al cambiar el tema
