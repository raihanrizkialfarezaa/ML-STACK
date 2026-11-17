@echo off
setlocal
cd /d "%~dp0\web"
echo ========================================================
echo   Wine Quality Hybrid AI: Next.js Frontend Server
echo   Random Forest (Bagging) + Association Rule Mining
echo ========================================================
echo Membuka server Next.js di http://localhost:3000 ...
echo Tekan Ctrl+C untuk menghentikan server.
echo.
npm run dev
