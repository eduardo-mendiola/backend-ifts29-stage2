# Script para forzar hover con rgba y mayor especificidad

$file = "public/css/themes.css"
$content = Get-Content $file -Raw

# Agregar reglas al final con máxima especificidad usando rgba
$forceHoverRules = @'

/* FORZAR hover claro en tablas - máxima prioridad */
html:not([data-theme="dark"]) .table-dark.table-hover tbody tr:hover,
html:not([data-theme="dark"]) .table-dark.table-hover tbody tr:hover > *,
html:not([data-theme="dark"]) .table.table-hover tbody tr:hover,
html:not([data-theme="dark"]) .table.table-hover tbody tr:hover > * {
  background-color: rgba(211, 213, 215, 1) !important;
  --bs-table-bg-state: rgba(211, 213, 215, 1) !important;
  --bs-table-bg-type: rgba(211, 213, 215, 1) !important;
}

/* Para asegurar que funcione en modo light explícito */
[data-theme="light"] .table-hover tbody tr:hover,
[data-theme="light"] .table-hover tbody tr:hover > * {
  background-color: rgba(211, 213, 215, 1) !important;
}
'@

$content = $content + $forceHoverRules

Set-Content $file -Value $content -NoNewline

Write-Host "✅ Reglas de hover con rgba agregadas"
