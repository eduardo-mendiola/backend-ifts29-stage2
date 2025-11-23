# Script para actualizar admin.pug con soporte de temas

$adminFile = "views/admin.pug"
$content = Get-Content $adminFile -Raw

# Reemplazar estilos inline de colores con clases CSS
$content = $content -replace 'style="color: #ffffff; font-weight: 700;"', 'class="text-themed" style="font-weight: 700;"'
$content = $content -replace 'style="color: #d3d3d3ff; font-weight: 600;"', 'class="text-themed-secondary" style="font-weight: 600;"'
$content = $content -replace '\.bg-dark\.', '.card.'
$content = $content -replace '\.text-white\.', '.text-themed.'
$content = $content -replace '\.text-secondary', '.text-themed-secondary'

# Guardar cambios
Set-Content $adminFile -Value $content -NoNewline

Write-Host "✅ Cambios aplicados a admin.pug"
