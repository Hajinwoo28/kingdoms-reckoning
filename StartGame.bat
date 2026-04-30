@echo off
title TB-TD Neon Defense Server
color 0B
echo ===================================================
echo     STARTING TB-TD NEON DEFENSE SERVER...
echo ===================================================
echo.
echo Please wait while the database and Ngrok tunnel start...
echo (Leave this black window open to keep the game online!)
echo.
python app.py
pause