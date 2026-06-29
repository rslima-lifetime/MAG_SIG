@echo off
title SIG - Inicializador
cls
echo ======================================================
echo                 INICIALIZADOR DO SIG
echo ======================================================
echo.
echo 1. Configurando ambiente Node.js local...
set PATH=C:\Users\roslima\.gemini\antigravity\node-v22.11.0-win-x64;%PATH%

echo 2. Abrindo o navegador padrao em http://localhost:3000...
start "" http://localhost:3000

echo 3. Iniciando servidor estatico na porta 3000...
node server.js

pause
