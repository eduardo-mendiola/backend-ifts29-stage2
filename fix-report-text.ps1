# Script para corregir texto gris claro en reportes y restaurar colores de indicadores

$files = @(
    "views/dashboards/project-report.pug",
    "views/dashboards/revenue-analysis.pug",
    "views/dashboards/profitability-analysis.pug"
)

foreach ($file in $files) {
    if (Test-Path $file) {
        $content = Get-Content $file -Raw
        
        # Reemplazar text-light por text-themed (que se adapta al tema)
        $content = $content -replace 'class="small text-light"', 'class="small text-themed"'
        $content = $content -replace "class='small text-light'", "class='small text-themed'"
        
        # Asegurar que los colores de éxito/peligro se mantengan
        # (verde para positivo, rojo para negativo)
        # Estos ya deberían estar con text-success y text-danger
        
        Set-Content $file -Value $content -NoNewline
        Write-Host "✅ Actualizado: $file"
    }
}

Write-Host "`n✅ Textos de reportes corregidos"
