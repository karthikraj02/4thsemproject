@echo off
title LANDrop Secure - One Click Run

echo Starting LANDrop Secure...

REM Start Python Receiver
start cmd /k "cd python_engine && python server.py"

REM Start Discovery Server
start cmd /k "cd python_engine && python discovery_server.py"

REM Start Node Backend
start cmd /k "cd backend && node server.js"

REM Start React UI (if in development mode)
start cmd /k "cd frontend && npm start"

REM Start Electron App
start cmd /k "npm start"

echo All services started!
pause