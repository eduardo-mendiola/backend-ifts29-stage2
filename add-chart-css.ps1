# Script para agregar estilos CSS que fuercen colores en gráficos Chart.js

$file = "public/css/themes.css"
$content = Get-Content $file -Raw

# Agregar estilos globales para Chart.js
$chartStyles = @'

/* Forzar colores de texto en gráficos Chart.js para modo claro */
body:not([data-theme="dark"]) canvas {
  color: #343a40 !important;
}

/* Usar variables CSS personalizadas para Chart.js */
:root {
  --chart-label-color: #343a40;
  --chart-grid-color: #dee2e6;
}

[data-theme="dark"] {
  --chart-label-color: #f0f0f0;
  --chart-grid-color: rgba(255, 255, 255, 0.1);
}
'@

$content = $content + $chartStyles

Set-Content $file -Value $content -NoNewline

Write-Host "✅ Estilos CSS para gráficos agregados"
