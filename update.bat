@echo off
SETLOCAL ENABLEDELAYEDEXPANSION

:: ----------------------------
:: 🔹 Configuración
:: ----------------------------
set SERVER_IP=192.168.1.156
set BOT_PATH=/root/bot
set GIT_REPO=https://github.com/vegettababy14-commits/discord-bot.git
set BRANCH=main

:: ----------------------------
:: 🔹 Actualizar código local
:: ----------------------------
echo ================================
echo Actualizando código del bot...
git add .
git commit -m "Actualización desde BAT" 2>nul
git push origin %BRANCH%
echo ================================

:: ----------------------------
:: 🔹 Conectar al servidor y actualizar contenedor
:: ----------------------------
echo Conectando al servidor %SERVER_IP%...
plink root@%SERVER_IP%
(
    echo ================================
    echo Parando contenedor Docker viejo...
    docker compose -f %BOT_PATH%/docker-compose.yml down

    echo Pull del repo...
    cd %BOT_PATH%
    git fetch origin
    git reset --hard origin/%BRANCH%

    echo Levantando nuevo contenedor...
    docker compose -f docker-compose.yml up -d

    echo ================================
    echo Mostrando logs recientes...
    docker compose -f docker-compose.yml logs --tail=20 -f
)

echo ================================
echo Actualización completada. Revisa los logs arriba.
echo Presiona cualquier tecla para cerrar este script...
pause >nul

