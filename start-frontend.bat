@echo off
set PORT=23280
set BASE_PATH=/
cd /d "%~dp0"
echo Starting Frontend on port 23280...
pnpm --filter @workspace/gmi-website run dev
pause
