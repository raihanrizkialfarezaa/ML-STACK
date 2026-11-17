@echo off
title Wine Quality Web Monograph - Next.js Server
color 0F
cd /d "%~dp0\web"

echo ===============================================================================
echo   WINE QUALITY MONOGRAPH: SERVER FRONTEND WEB NEXT.JS
echo ===============================================================================
echo.
echo [*] Membuka browser ke http://localhost:3000 dalam 3 detik...
start "" timeout /t 3 /nobreak >nul & start http://localhost:3000
echo [*] Menjalankan server dev Next.js...
echo     Tekan Ctrl+C di terminal ini untuk mematikan server.
echo.
npm run dev
