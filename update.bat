@echo off
REM Commit y push
git add .
git commit -m "Cambios del bot"
git push origin main

REM Conectar al servidor y ejecutar update_bot.sh usando plink
REM Cambia TU_PASSWORD por la contraseña real
plink.exe root@192.168.1.156 -pw TU_PASSWORD "cd /root/bot && ./update_bot.sh"

REM Mostrar logs recientes del contenedor
plink.exe root@192.168.1.156 -pw Xelcore1234 "docker logs --tail 20 bot-bot-1"

echo ===================================================
echo Presiona cualquier tecla para cerrar este script...
pause
