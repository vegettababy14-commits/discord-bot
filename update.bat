@echo off
REM Commit y push
git add .
git commit -m "Cambios del bot"
git push origin main

REM Ejecutar actualización en el servidor y guardar salida
echo Conectando al servidor y actualizando...
ssh root@Servicios "cd /root/bot && ./update_bot.sh" > output.log 2>&1

REM Mostrar los últimos 20 líneas de logs del servidor
echo ===================================================
echo Logs recientes del contenedor Docker:
ssh root@Servicios "docker logs --tail 20 bot-bot-1"
echo ===================================================

REM Esperar a que presiones una tecla antes de cerrar
echo Presiona cualquier tecla para cerrar este script...
pause
