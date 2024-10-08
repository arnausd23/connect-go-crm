@echo off
SETLOCAL

REM Establece el directorio de trabajo a la ubicación del ejecutable
SET "APP_DIR=%~dp0"

REM Cambia al directorio donde está el proyecto de Next.js
cd /d "%~dp0"

REM Inicia el servidor de Next.js en segundo plano y deja el CMD visible pero no en primer plano
start "" /b /min cmd.exe /c "npm run start"

REM Cierra la ventana de CMD inmediatamente
exit
