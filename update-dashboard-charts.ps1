# Script para reemplazar colores hardcodeados en gráficos por función dinámica

$dashboardFiles = @(
    "views/dashboards/project-report.pug",
    "views/dashboards/revenue-analysis.pug",
    "views/dashboards/profitability-analysis.pug",
    "views/dashboards/executive-dashboard.pug",
    "views/dashboards/team-performance.pug",
    "views/dashboards/client-analysis.pug"
)

foreach ($file in $dashboardFiles) {
    if (Test-Path $file) {
        $content = Get-Content $file -Raw
        
        # Reemplazar color hardcodeado #f0f0f0 por función que lee del tema
        $content = $content -replace "color: '#f0f0f0'", "color: getComputedStyle(document.documentElement).getPropertyValue('--chart-text').trim()"
        $content = $content -replace 'color: "#f0f0f0"', "color: getComputedStyle(document.documentElement).getPropertyValue('--chart-text').trim()"
        
        # Reemplazar grid color hardcodeado
        $content = $content -replace "color: 'rgba\(255, 255, 255, 0\.1\)'", "color: getComputedStyle(document.documentElement).getPropertyValue('--chart-grid').trim()"
        $content = $content -replace 'color: "rgba\(255, 255, 255, 0\.1\)"', "color: getComputedStyle(document.documentElement).getPropertyValue('--chart-grid').trim()"
        
        Set-Content $file -Value $content -NoNewline
        Write-Host "✅ Actualizado: $file"
    }
    else {
        Write-Host "⚠️  No encontrado: $file"
    }
}

Write-Host "`n✅ Todos los dashboards actualizados"
