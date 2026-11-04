@echo off
title ExamForge AI - Frontend
cd /d "%~dp0frontend"
echo ==============================================
echo Starting ExamForge AI Frontend Client...
echo URL: http://localhost:5173
echo ==============================================
call npm run dev
pause
