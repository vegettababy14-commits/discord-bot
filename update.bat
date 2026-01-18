@echo off
REM =========================
REM 1️⃣ Commit y push al repositorio
REM =========================
git add .
git commit -m "Cambios del bot"
git push origin main

REM =========================
REM 2️⃣ Conectarse al servidor y ejecutar el script de actualización
REM =========================
echo Conectando al servidor 192.168.1.156 y actualizando...
ssh root@192.168.1.156 "cd /root/bot && ./update_bot.sh" > output.log 2>&1

REM =========================
REM 3️⃣ Mostrar logs recientes del contenedor Docker
REM =========================
echo ===================================================
echo Logs recientes del contenedor Docker:
ssh root@192.168.1.156 "docker logs --tail 20 bot-bot-1"
echo ===================================================

REM =========================
REM 4️⃣ Esperar a que presiones una tecla antes de cerrar
REM =========================
echo Presiona cualquier tecla para cerrar este script...
pause
