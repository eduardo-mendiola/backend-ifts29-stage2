# Script final para actualizar TODOS los colores hardcodeados en dashboards

$dashboardPath = "views/dashboards"
$files = Get-ChildItem -Path $dashboardPath -Filter "*.pug"

$replacements = @{
    "'#f0f0f0'"                  = "getComputedStyle(document.documentElement).getPropertyValue('--chart-text').trim()"
    '"#f0f0f0"'                  = "getComputedStyle(document.documentElement).getPropertyValue('--chart-text').trim()"
    "'rgba(255, 255, 255, 0.1)'" = "getComputedStyle(document.documentElement).getPropertyValue('--chart-grid').trim()"
    '"rgba(255, 255, 255, 0.1)"' = "getComputedStyle(document.documentElement).getPropertyValue('--chart-grid').trim()"
}

foreach ($file in $files) {
    $content = Get-Content $file.FullName -Raw
    $originalContent = $content
    
    foreach ($old in $replacements.Keys) {
        $new = $replacements[$old]
        $content = $content -replace [regex]::Escape($old), $new
    }
    
    if ($content -ne $originalContent) {
        Set-Content $file.FullName -Value $content -NoNewline
        Write-Host "✅ Actualizado: $($file.Name)"
    }
    else {
        Write-Host "⏭️  Sin cambios necesarios: $($file.Name)"
    }
}

Write-Host "`n✅ Todos los dashboards procesados"
