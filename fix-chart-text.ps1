# Script para cambiar color de texto en gráficos para modo claro

$file = "public/css/themes.css"
$content = Get-Content $file -Raw

# Cambiar color de texto de gráficos de gris claro a oscuro
$content = $content -replace '--chart-text: #333333;', '--chart-text: #343a40;'

# También actualizar el color de grid para mejor contraste
$content = $content -replace '--chart-grid: #e0e0e0;', '--chart-grid: #dee2e6;'

Set-Content $file -Value $content -NoNewline

Write-Host "✅ Color de texto en gráficos actualizado para modo claro"
