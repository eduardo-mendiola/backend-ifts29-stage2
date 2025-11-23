# Script para agregar función global que obtiene colores de gráficos del tema actual

$file = "public/js/chart-themes.js"
$content = Get-Content $file -Raw

# Actualizar la función getChartThemeColors para leer del CSS
$newFunction = @'
/**
 * Obtiene los colores del tema actual para gráficos desde las variables CSS
 * @returns {Object} Objeto con colores para gráficos
 */
function getChartThemeColors() {
  // Leer las variables CSS del documento
  const root = document.documentElement;
  const computedStyle = getComputedStyle(root);
  
  return {
    gridColor: computedStyle.getPropertyValue('--chart-grid').trim() || '#444444',
    textColor: computedStyle.getPropertyValue('--chart-text').trim() || '#f0f0f0',
    backgroundColor: computedStyle.getPropertyValue('--chart-bg').trim() || 'rgba(255, 255, 255, 0.05)',
    borderColor: computedStyle.getPropertyValue('--border-color').trim() || 'rgba(255, 255, 255, 0.1)',
    tooltipBg: computedStyle.getPropertyValue('--modal-bg').trim() || '#2a2a2a',
    tooltipBorder: computedStyle.getPropertyValue('--border-color').trim() || 'rgba(255, 255, 255, 0.2)'
  };
}
'@

# Reemplazar la función existente
$content = $content -replace '(?s)/\*\*\s+\* Obtiene los colores del tema actual.*?\n\}', $newFunction

Set-Content $file -Value $content -NoNewline

Write-Host "✅ Función getChartThemeColors actualizada para leer variables CSS"
