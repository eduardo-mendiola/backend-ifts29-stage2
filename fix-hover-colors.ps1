# Script para cambiar colores de hover y active en modo claro

$file = "public/css/themes.css"
$content = Get-Content $file -Raw

# Cambiar nav-hover de gris oscuro a gris muy claro
$content = $content -replace '--nav-hover: #495057;', '--nav-hover: #e9ecef;'

# Cambiar nav-active de gris medio a gris claro
$content = $content -replace '--nav-active: #6c757d;', '--nav-active: #dee2e6;'

# Cambiar table-hover a gris muy claro
$content = $content -replace '--table-hover: #f8f9fa;', '--table-hover: #e9ecef;'

Set-Content $file -Value $content -NoNewline

Write-Host "✅ Colores de hover y active actualizados a gris claro"
