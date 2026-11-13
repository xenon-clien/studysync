@echo off
title StudySync Quick Launcher
chcp 65001 >nul
cls

echo ========================================================
echo        🎓 Starting StudySync Full-Stack Platform
echo ========================================================
echo.

:: 1. Check MongoDB service
echo [1/4] Checking MongoDB service...
sc query MongoDB | find "RUNNING" >nul 2>&1
if errorlevel 1 (
    echo [*] Starting MongoDB service...
    net start MongoDB >nul 2>&1
    if errorlevel 1 (
        echo [!] Note: MongoDB service not running as Windows Service.
        echo [!] (If using MongoDB Atlas or standalone mongod, please ensure it is running)
    ) else (
        echo [✓] MongoDB service started.
    )
) else (
    echo [✓] MongoDB is running.
)
echo.

:: 2. Start Backend Server (Port 3001)
echo [2/4] Launching Backend Server on port 3001...
start "StudySync Backend (Port 3001)" cmd /c "title StudySync Backend && cd /d "%~dp0backend" && node server.js"
echo [✓] Backend process launched.
echo.

:: 3. Start Frontend Dev Server (Port 5173)
echo [3/4] Launching Frontend Dev Server on port 5173...
start "StudySync Frontend (Port 5173)" cmd /c "title StudySync Frontend && cd /d "%~dp0StudySync" && npm run dev"
echo [✓] Frontend process launched.
echo.

:: 4. Wait for Vite server and open browser
echo [4/4] Opening StudySync in your default browser...
timeout /t 3 /nobreak >nul

start http://localhost:5173

echo.
echo ========================================================
echo  🚀 StudySync is running at: http://localhost:5173
echo  🌐 Backend API is running at: http://localhost:3001
echo ========================================================
echo.
echo (Servers background me chalte rahenge. Band karne ke liye 'stop.bat' chalaayein.)
timeout /t 4 >nul
exit
