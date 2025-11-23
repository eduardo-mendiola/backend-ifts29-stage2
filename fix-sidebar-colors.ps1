# Script para actualizar colores de sidebar en modo claro

$file = "public/css/themes.css"
$content = Get-Content $file -Raw

# Reemplazar color de fondo de sidebar en modo claro
$content = $content -replace '--bg-sidebar: #343a40;', '--bg-sidebar: #e9ecef;'

# Reemplazar color de texto de sidebar en modo claro
$content = $content -replace '--text-sidebar: #ffffff;', '--text-sidebar: #212529;'
$content = $content -replace '--text-sidebar-muted: rgba\(255, 255, 255, 0\.7\);', '--text-sidebar-muted: rgba(33, 37, 41, 0.7);'

Set-Content $file -Value $content -NoNewline

Write-Host "✅ Colores de sidebar actualizados para modo claro"
