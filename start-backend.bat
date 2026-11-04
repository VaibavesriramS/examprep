@echo off
title ExamForge AI - Backend API
cd /d "%~dp0backend"
echo ==============================================
echo Starting ExamForge AI Backend Service...
echo Swagger Docs: http://localhost:8000/docs
echo Root API:     http://localhost:8000/
echo ==============================================
call .venv\Scripts\activate.bat
uvicorn app.main:app --reload --port 8000
pause
