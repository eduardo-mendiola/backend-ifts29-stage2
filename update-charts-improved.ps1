# Script mejorado para actualizar colores de gráficos en dashboards

$dashboardPath = "views/dashboards"
$files = Get-ChildItem -Path $dashboardPath -Filter "*.pug"

foreach ($file in $files) {
    $content = Get-Content $file.FullName -Raw
    $modified = $false
    
    # Reemplazar labels: { color: '#f0f0f0' }
    if ($content -match "labels:\s*\{\s*color:\s*'#f0f0f0'") {
        $content = $content -replace "labels:\s*\{\s*color:\s*'#f0f0f0'", "labels: { color: getComputedStyle(document.documentElement).getPropertyValue('--chart-text').trim()"
        $modified = $true
    }
    
    # Reemplazar ticks: { color: '#f0f0f0' }
    if ($content -match "ticks:\s*\{\s*color:\s*'#f0f0f0'") {
        $content = $content -replace "ticks:\s*\{\s*color:\s*'#f0f0f0'", "ticks: { color: getComputedStyle(document.documentElement).getPropertyValue('--chart-text').trim()"
        $modified = $true
    }
    
    # Reemplazar grid: { color: 'rgba(255, 255, 255, 0.1)' }
    if ($content -match "grid:\s*\{\s*color:\s*'rgba\(255,\s*255,\s*255,\s*0\.1\)'") {
        $content = $content -replace "grid:\s*\{\s*color:\s*'rgba\(255,\s*255,\s*255,\s*0\.1\)'", "grid: { color: getComputedStyle(document.documentElement).getPropertyValue('--chart-grid').trim()"
        $modified = $true
    }
    
    if ($modified) {
        Set-Content $file.FullName -Value $content -NoNewline
        Write-Host "✅ Actualizado: $($file.Name)"
    }
    else {
        Write-Host "⏭️  Sin cambios: $($file.Name)"
    }
}

Write-Host "`n✅ Proceso completado"
