@echo off
setlocal
cd /d "%~dp0"

where node >nul 2>&1
if errorlevel 1 (
  echo Node.js fehlt. Bitte Node.js 22.13 oder neuer installieren:
  echo https://nodejs.org/en/download
  pause
  exit /b 1
)

node scripts\start-local.mjs
if errorlevel 1 (
  echo.
  echo Der Start ist fehlgeschlagen. Die Fehlermeldung steht oben.
  pause
  exit /b 1
)
