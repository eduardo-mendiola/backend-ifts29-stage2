# Script para aumentar más el grosor del texto

$file = "public/css/themes.css"
$content = Get-Content $file -Raw

# Cambiar font-weight de 500 a 600 para más grosor
$content = $content -replace 'font-weight: 500;', 'font-weight: 600;'

Set-Content $file -Value $content -NoNewline

Write-Host "✅ Font-weight aumentado a 600"
