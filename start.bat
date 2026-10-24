@echo off
setlocal
cd /d "%~dp0"

set "NODE_READY="
where node >nul 2>&1
if not errorlevel 1 (
  node -e "const [major,minor]=process.versions.node.split('.').map(Number);process.exit(major>22||(major===22&&minor>=13)?0:1)" >nul 2>&1
  if not errorlevel 1 set "NODE_READY=1"
)

if not defined NODE_READY (
  echo Lade beim ersten Start eine portable Laufzeit herunter ...
  powershell.exe -NoProfile -ExecutionPolicy Bypass -File "%~dp0scripts\bootstrap-node.ps1"
  if errorlevel 1 (
    echo.
    echo Der Download ist fehlgeschlagen. Bitte Internetverbindung pruefen.
    pause
    exit /b 1
  )
  set "PATH=%~dp0.portable-node\node-v24.21.0-win-x64;%PATH%"
)

node scripts\start-local.mjs
if errorlevel 1 (
  echo.
  echo Der Start ist fehlgeschlagen. Die Fehlermeldung steht oben.
  pause
  exit /b 1
)
