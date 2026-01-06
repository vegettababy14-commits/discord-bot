# Ruta a tu repo local
$repoPath = "E:\DISCORDBOT"
$commitMessage = "Actualización automática del bot $(Get-Date -Format 'yyyy-MM-dd HH:mm')"

# Ir al repo
Set-Location $repoPath

# Añadir todos los cambios
git add .

# Hacer commit
git commit -m $commitMessage

# Subir a GitHub
git push origin main

Write-Host "Bot actualizado en GitHub correctamente!"
