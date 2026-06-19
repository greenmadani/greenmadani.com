@echo off
cd /d "%~dp0artifacts\api-server"
if exist .env (
  for /f "usebackq delims=" %%a in (.env) do (
    for /f "tokens=1,* delims==" %%b in ("%%a") do (
      if not "%%b"=="" if not "%%b"=="#" set "%%b=%%c"
    )
  )
)
if "%DATABASE_URL%"=="" (
  echo ERROR: DATABASE_URL not set. Copy .env.example to .env and fill in your values.
  pause
  exit /b 1
)
echo Starting API Server on port 8080...
node --enable-source-maps ./dist/index.mjs
