# Script para mejorar colores de texto en modo claro

$file = "public/css/themes.css"
$content = Get-Content $file -Raw

# Cambiar texto principal de negro puro a gris oscuro
$content = $content -replace '--text-primary: #212529;', '--text-primary: #343a40;'

# Cambiar texto secundario a un gris más oscuro para mejor contraste
$content = $content -replace '--text-secondary: #6c757d;', '--text-secondary: #495057;'

# Cambiar texto de sidebar a gris oscuro en lugar de negro
$content = $content -replace '--text-sidebar: #212529;', '--text-sidebar: #343a40;'

# Ajustar texto muted de sidebar
$content = $content -replace '--text-sidebar-muted: rgba\(33, 37, 41, 0\.7\);', '--text-sidebar-muted: rgba(52, 58, 64, 0.75);'

Set-Content $file -Value $content -NoNewline

Write-Host "✅ Colores de texto actualizados para mejor legibilidad en modo claro"
