@echo off
echo ========================================================
echo Starting GaonKaam Village Employment & Commerce Portal
echo ========================================================
echo.
echo 1. Opening local HTTP server (http://localhost:8080)...
start "" "http://localhost:8080"
echo.
echo 2. Also opening direct file link:
start "" "%~dp0index.html"
echo.
echo Local server is active. Keep this window open if running local server.
echo.
pause
