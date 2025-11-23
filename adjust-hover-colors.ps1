# Script para ajustar colores de hover un poco más oscuros

$file = "public/css/themes.css"
$content = Get-Content $file -Raw

# Cambiar nav-hover a un gris un poco más oscuro que el fondo
$content = $content -replace '--nav-hover: #e9ecef;', '--nav-hover: #d3d5d7;'

# Cambiar nav-active también un poco más oscuro
$content = $content -replace '--nav-active: #dee2e6;', '--nav-active: #c8ccd0;'

# Cambiar table-hover a un gris un poco más oscuro
$content = $content -replace '--table-hover: #e9ecef;', '--table-hover: #d3d5d7;'

Set-Content $file -Value $content -NoNewline

Write-Host "✅ Colores de hover ajustados a un tono más oscuro"
