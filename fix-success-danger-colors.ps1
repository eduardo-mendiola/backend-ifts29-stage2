# Script para ajustar intensidad de texto y asegurar colores verde/rojo

$file = "public/css/themes.css"
$content = Get-Content $file -Raw

# Agregar overrides para text-success y text-danger en modo claro
$colorOverrides = @'

/* Asegurar que text-success y text-danger funcionen en modo claro */
body:not([data-theme="dark"]) .text-success,
html:not([data-theme="dark"]) .text-success {
  color: #198754 !important;
}

body:not([data-theme="dark"]) .text-danger,
html:not([data-theme="dark"]) .text-danger {
  color: #dc3545 !important;
}

/* Ajustar intensidad de text-themed para que no sea tan fuerte */
.text-themed {
  color: var(--text-primary) !important;
  opacity: 0.9;
}
'@

$content = $content + $colorOverrides

Set-Content $file -Value $content -NoNewline

Write-Host "✅ Colores de éxito/peligro y opacidad de texto ajustados"
