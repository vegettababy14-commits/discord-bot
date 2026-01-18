@echo off
setlocal

echo ================================================
echo 🔄 Actualizando bot de Discord...
echo ================================================

REM ----------------------------
REM 1️⃣ Guardar cambios locales y subir a Git
REM ----------------------------
git add .
git commit -m "Actualización desde BAT"
git push origin main

REM ----------------------------
REM 2️⃣ Conectarse al servidor y actualizar contenedor Docker
REM ----------------------------
set SERVER_IP=192.168.1.156
set SSH_USER=root

echo Conectando al servidor %SERVER_IP%...
ssh %SSH_USER%@%SERVER_IP% ^
"echo ================================================; ^
echo Parando contenedor Docker viejo...; ^
docker stop bot-bot-1; ^
docker rm bot-bot-1; ^
echo Pull del repo...; ^
cd /root/bot; git pull; ^
echo Levantando nuevo contenedor...; ^
docker-compose up -d; ^
echo Mostrando logs recientes...; ^
docker logs -f bot-bot-1"

echo ================================================
echo ✅ Actualización completada.
pause
