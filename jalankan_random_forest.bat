@echo off
title Eksekusi Pipeline Random Forest Wine Quality
color 0F
cd /d "%~dp0"

echo ===============================================================================
echo   PIPELINE MACHINE LEARNING: RANDOM FOREST UCI WINE QUALITY
echo ===============================================================================
echo.
echo Mencari interpreter Python...

set PYTHON_CMD=

if exist ".venv\Scripts\python.exe" (
    set PYTHON_CMD=.venv\Scripts\python.exe
    echo [+] Menggunakan Virtual Environment (.venv)
) else (
    where python >nul 2>nul
    if %errorlevel% equ 0 (
        set PYTHON_CMD=python
        echo [+] Menggunakan Python Global Sistem
    )
)

if "%PYTHON_CMD%"=="" (
    echo [!] ERROR: Python tidak ditemukan di sistem atau .venv.
    echo     Pastikan Python sudah terinstall dan terdaftar di PATH.
    echo.
    pause
    exit /b 1
)

echo [*] Menjalankan: random_forest_colab.py ...
echo.
"%PYTHON_CMD%" random_forest_colab.py

echo.
echo ===============================================================================
echo   EKSEKUSI SELESAI!
echo   Dashboard visualisasi tersimpan di: wine_random_forest_dashboard.png
echo ===============================================================================
echo.
pause
