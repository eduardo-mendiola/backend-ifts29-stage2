# Script para corregir colores de th (headers) en tablas show para modo claro

$file = "public/css/themes.css"
$content = Get-Content $file -Raw

# Agregar reglas para th en modo claro
$thRules = @'

/* Corregir th (headers) en tablas para modo claro */
body:not([data-theme="dark"]) .table th,
body:not([data-theme="dark"]) .table-dark th,
html:not([data-theme="dark"]) .table th,
html:not([data-theme="dark"]) .table-dark th {
  background-color: #e9ecef !important;
  color: #343a40 !important;
  border-color: #dee2e6 !important;
}

body:not([data-theme="dark"]) .table thead th,
body:not([data-theme="dark"]) .table-dark thead th,
html:not([data-theme="dark"]) .table thead th,
html:not([data-theme="dark"]) .table-dark thead th {
  background-color: #e9ecef !important;
  color: #343a40 !important;
}

body:not([data-theme="dark"]) .table tbody th,
body:not([data-theme="dark"]) .table-dark tbody th,
html:not([data-theme="dark"]) .table tbody th,
html:not([data-theme="dark"]) .table-dark tbody th {
  background-color: #e9ecef !important;
  color: #343a40 !important;
}
'@

$content = $content + $thRules

Set-Content $file -Value $content -NoNewline

Write-Host "✅ Colores de th corregidos para modo claro"
