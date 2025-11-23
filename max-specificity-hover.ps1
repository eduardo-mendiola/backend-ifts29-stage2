# Script para agregar regla con especificidad máxima usando !important en cascada

$file = "public/css/themes.css"
$content = Get-Content $file -Raw

# Agregar regla con especificidad absoluta al final
$maxSpecificity = @'

/* MÁXIMA ESPECIFICIDAD - Forzar hover claro en TODAS las tablas */
body:not([data-theme="dark"]) .table-hover tbody tr:hover,
body:not([data-theme="dark"]) .table-hover tbody tr:hover td,
body:not([data-theme="dark"]) .table-hover tbody tr:hover th,
body:not([data-theme="dark"]) .table-dark tbody tr:hover,
body:not([data-theme="dark"]) .table-dark tbody tr:hover td,
body:not([data-theme="dark"]) .table-dark tbody tr:hover th {
  background-color: #d3d5d7 !important;
  background: #d3d5d7 !important;
}
'@

$content = $content + $maxSpecificity

Set-Content $file -Value $content -NoNewline

Write-Host "✅ Regla con máxima especificidad agregada"
