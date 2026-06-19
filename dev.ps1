$apiDir = Join-Path $PWD "artifacts/api-server"
$envFile = Join-Path $apiDir ".env"

if (Test-Path $envFile) {
  Get-Content $envFile | ForEach-Object {
    if ($_ -match '^\s*([^#][^=]+)=(.*)\s*$') {
      Set-Item -Path "env:$($matches[1])" -Value $matches[2]
    }
  }
}

if (-not $env:DATABASE_URL) {
  Write-Error "DATABASE_URL not set. Copy artifacts/api-server/.env.example to .env and fill in your values."
  exit 1
}

Write-Host "Starting API server on port 8080..."
Start-Process -FilePath "cmd.exe" -ArgumentList "/c", "start", "GMI API", "cmd", "/k", "`"set DATABASE_URL=$env:DATABASE_URL && set SUPABASE_URL=$env:SUPABASE_URL && set SUPABASE_SERVICE_ROLE_KEY=$env:SUPABASE_SERVICE_ROLE_KEY && set SUPABASE_ANON_KEY=$env:SUPABASE_ANON_KEY && set PORT=8080 && cd /d `"$apiDir`" && node --enable-source-maps ./dist/index.mjs`""

Start-Sleep -Seconds 3

Write-Host "Starting Frontend on port 23280..."
Start-Process -FilePath "cmd.exe" -ArgumentList "/c", "start", "GMI Frontend", "cmd", "/k", "`"set PORT=23280 && set BASE_PATH=/ && cd /d `"$PWD`" && pnpm --filter @workspace/gmi-website run dev`""

Write-Host ""
Write-Host "Site: http://localhost:23280"
Write-Host "API:  http://localhost:8080/api"
