# Script para cambiar botones amarillos a gris oscuro en modo claro

$file = "public/css/themes.css"
$content = Get-Content $file -Raw

# Agregar override para btn-outline-warning en modo claro
$buttonOverride = @'

/* Cambiar botones outline-warning a gris oscuro en modo claro */
body:not([data-theme="dark"]) .btn-outline-warning,
html:not([data-theme="dark"]) .btn-outline-warning {
  color: #495057 !important;
  border-color: #495057 !important;
}

body:not([data-theme="dark"]) .btn-outline-warning:hover,
html:not([data-theme="dark"]) .btn-outline-warning:hover {
  color: #ffffff !important;
  background-color: #495057 !important;
  border-color: #495057 !important;
}
'@

$content = $content + $buttonOverride

Set-Content $file -Value $content -NoNewline

Write-Host "✅ Botones outline-warning actualizados para modo claro"
