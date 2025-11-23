# Script para agregar override más fuerte para tablas con clase table-dark

$file = "public/css/themes.css"
$content = Get-Content $file -Raw

# Agregar al final del archivo reglas más específicas y con mayor prioridad
$additionalRules = @'

/* Override FUERTE para hover en tablas Bootstrap - modo claro */
[data-theme="light"] .table-dark tbody tr:hover,
[data-theme="light"] .table-dark tbody tr:hover td,
[data-theme="light"] .table-dark tbody tr:hover th,
:root .table-dark tbody tr:hover,
:root .table-dark tbody tr:hover td,
:root .table-dark tbody tr:hover th {
  background-color: #d3d5d7 !important;
  --bs-table-bg: #d3d5d7 !important;
  --bs-table-accent-bg: #d3d5d7 !important;
}

/* Para tablas sin data-theme (modo claro por defecto) */
html:not([data-theme="dark"]) .table-hover tbody tr:hover,
html:not([data-theme="dark"]) .table-hover tbody tr:hover td,
html:not([data-theme="dark"]) .table-hover tbody tr:hover th {
  background-color: #d3d5d7 !important;
  --bs-table-bg: #d3d5d7 !important;
  --bs-table-accent-bg: #d3d5d7 !important;
}
'@

$content = $content + $additionalRules

Set-Content $file -Value $content -NoNewline

Write-Host "✅ Override FUERTE para hover de tablas agregado"
