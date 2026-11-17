@echo off
title Buka Google Colab Notebook
cd /d "%~dp0"

echo ===============================================================================
echo   MEMBUKA GOOGLE COLAB DI BROWSER DEFAULT
echo ===============================================================================
echo.
echo Membuka: https://colab.research.google.com/ ...
start https://colab.research.google.com/
echo Selesai. Anda dapat mengunggah file wine_quality_random_forest.ipynb.
timeout /t 3
