# Script para agregar override específico para hover de tablas Bootstrap

$file = "public/css/themes.css"
$content = Get-Content $file -Raw

# Buscar la sección de .table-hover y agregar más reglas específicas
$pattern = '(\.table-hover tbody tr:hover \{\s+background-color: var\(--table-hover\) !important;\s+\})'
$replacement = '$1

/* Override más específico para tablas Bootstrap en modo claro */
.table-hover > tbody > tr:hover > * {
  --bs-table-accent-bg: var(--table-hover) !important;
  background-color: var(--table-hover) !important;
}

.table-dark.table-hover tbody tr:hover {
  background-color: var(--table-hover) !important;
}

.table-dark.table-hover tbody tr:hover td,
.table-dark.table-hover tbody tr:hover th {
  background-color: var(--table-hover) !important;
}'

$content = $content -replace $pattern, $replacement

Set-Content $file -Value $content -NoNewline

Write-Host "✅ Override de hover para tablas Bootstrap agregado"
