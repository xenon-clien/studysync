@echo off
title StudySync Server Stopper
chcp 65001 >nul
cls

echo ========================================================
echo        🛑 Stopping StudySync Servers (5173 & 3001)
echo ========================================================
echo.

powershell -NoProfile -Command "$ports = @(5173, 3001); foreach ($p in $ports) { $conns = Get-NetTCPConnection -LocalPort $p -ErrorAction SilentlyContinue; if ($conns) { $conns | Select-Object -ExpandProperty OwningProcess -Unique | ForEach-Object { Write-Host \"[*] Stopping process on port $p (PID: $_)...\" -ForegroundColor Yellow; Stop-Process -Id $_ -Force -ErrorAction SilentlyContinue; } } else { Write-Host \"[✓] Port $p is clear.\" -ForegroundColor Green; } }"

echo.
echo [✓] StudySync Frontend and Backend servers have been stopped.
timeout /t 3 >nul
exit
