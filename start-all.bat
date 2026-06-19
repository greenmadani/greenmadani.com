@echo off
start "GMI API Server" cmd /k "%~dp0start-api.bat"
timeout /t 3 /nobreak >nul
start "GMI Frontend" cmd /k "%~dp0start-frontend.bat"
echo.
echo Both servers started!
echo Frontend: http://localhost:23280
echo API:      http://localhost:8080/api
echo.
echo Close the windows to stop the servers.
pause
