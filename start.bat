@echo off
title StudySync Launcher
cls

echo ========================================================
echo        Starting StudySync Full-Stack Platform
echo ========================================================
echo.

echo [1/3] Starting Backend Server (Port 3001)...
start "StudySync Backend" cmd /k "title StudySync Backend (Port 3001) & cd /d %~dp0backend & node server.js"
echo [OK] Backend initiated.
echo.

echo [2/3] Starting Frontend Server (Port 5173)...
start "StudySync Frontend" cmd /k "title StudySync Frontend (Port 5173) & cd /d %~dp0StudySync & npm run dev"
echo [OK] Frontend initiated.
echo.

echo [3/3] Opening browser in 3 seconds...
ping 127.0.0.1 -n 4 >nul

start http://localhost:5173

echo.
echo ========================================================
echo  StudySync is running at: http://localhost:5173
echo  Backend API is running at: http://localhost:3001
echo ========================================================
echo.
ping 127.0.0.1 -n 3 >nul
exit
