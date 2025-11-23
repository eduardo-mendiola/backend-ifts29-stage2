# Script para agregar font-weight medio al texto

$file = "public/css/themes.css"
$content = Get-Content $file -Raw

# Buscar la sección de transiciones y agregar font-weight después
$pattern = '(\.accordion-button \{\s+transition: background-color 0\.3s ease, color 0\.3s ease, border-color 0\.3s ease;\s+\})'
$replacement = '$1

/* Mejorar grosor de texto para mejor legibilidad */
body {
  font-weight: 500;
}

/* Mantener peso normal para inputs */
.form-control,
.form-select,
input,
textarea {
  font-weight: 400;
}'

$content = $content -replace $pattern, $replacement

Set-Content $file -Value $content -NoNewline

Write-Host "✅ Font-weight agregado para mejor legibilidad"
