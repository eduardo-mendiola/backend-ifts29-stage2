# Script para aplicar cambios de modo oscuro/claro a layout.pug

$layoutFile = "views/layout.pug"
$content = Get-Content $layoutFile -Raw

# 1. Agregar link a themes.css después de Bootstrap Icons
$content = $content -replace '(link\(rel="stylesheet", href="https://cdn\.jsdelivr\.net/npm/bootstrap-icons@1\.11\.3/font/bootstrap-icons\.css"\))', "`$1`r`n    link(rel=`"stylesheet`", href=`"/css/themes.css`")"

# 2. Agregar script de theme-toggle.js después del favicon
$content = $content -replace '(link\(rel="icon" type="image/x-icon" href="/images/favicon\.webp"\))', "`$1`r`n    script(src=`"/js/theme-toggle.js`")"

# 3. Reemplazar colores hardcodeados con variables CSS
$content = $content -replace 'background-color: #121212;', 'background-color: var(--bg-primary);'
$content = $content -replace 'color: #f0f0f0;', 'color: var(--text-primary);'
$content = $content -replace 'background-color: #212529;', 'background-color: var(--bg-sidebar);'
$content = $content -replace 'color: white;', 'color: var(--text-sidebar);'
$content = $content -replace 'background-color: #444;', 'background-color: var(--scrollbar-thumb);'
$content = $content -replace 'background-color: #666;', 'background-color: var(--scrollbar-thumb-hover);'
$content = $content -replace 'border-top: 1px solid rgba\(255, 255, 255, 0\.1\);', 'border-top: 1px solid var(--border-color);'
$content = $content -replace 'color: #ffffffb3;', 'color: var(--text-sidebar-muted);'
$content = $content -replace 'background-color: #60606033;', 'background-color: var(--nav-hover);'
$content = $content -replace 'background-color: #88888833 !important;', 'background-color: var(--nav-active) !important;'
$content = $content -replace 'color: #fff !important;', 'color: var(--text-sidebar) !important;'
$content = $content -replace 'background-color: #1e1e1e;', 'background-color: var(--table-bg);'

# 4. Agregar botón de tema en el dropdown
$dropdownPattern = '(a\.dropdown-item\(href="#"\) Settings)'
$themeButton = "a.dropdown-item(href=`"#`" onclick=`"toggleTheme(); return false;`")`r`n                  i#theme-icon.bi.bi-moon-fill.me-2`r`n                  span#theme-text Modo Oscuro`r`n              li`r`n                a.dropdown-item(href=`"#`") Configuración"
$content = $content -replace $dropdownPattern, $themeButton

# Guardar cambios
Set-Content $layoutFile -Value $content -NoNewline

Write-Host "✅ Cambios aplicados exitosamente a layout.pug"
Write-Host "📝 Revisa el archivo para asegurarte de que todo está correcto"
