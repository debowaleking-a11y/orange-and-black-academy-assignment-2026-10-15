@echo off
setlocal
cd /d "%~dp0"
set "NODE_DIR=%USERPROFILE%\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin"
set "PNPM_CMD=%USERPROFILE%\.cache\codex-runtimes\codex-primary-runtime\dependencies\bin\fallback\pnpm.cmd"
set "SITE_URL=http://127.0.0.1:5173/"

if not exist "%NODE_DIR%\node.exe" goto missing_runtime
if not exist "%PNPM_CMD%" goto missing_runtime
set "PATH=%NODE_DIR%;%PATH%"

if not exist "node_modules\vite\bin\vite.js" (
  echo Installing Carefair website packages on first launch...
  call "%PNPM_CMD%" install
  if errorlevel 1 goto install_error
)

powershell -NoProfile -Command "try { $r=Invoke-WebRequest -UseBasicParsing -TimeoutSec 2 'http://127.0.0.1:5173/'; if ($r.Content -match 'Carefair') { exit 0 }; exit 1 } catch { exit 1 }" >nul 2>nul
if not errorlevel 1 goto open_site

start "Carefair local server" /min "%NODE_DIR%\node.exe" "%~dp0node_modules\vite\bin\vite.js" --host 127.0.0.1 --port 5173 --strictPort
for /l %%i in (1,1,30) do (
  powershell -NoProfile -Command "try { $r=Invoke-WebRequest -UseBasicParsing -TimeoutSec 2 'http://127.0.0.1:5173/'; if ($r.Content -match 'Carefair') { exit 0 }; exit 1 } catch { exit 1 }" >nul 2>nul
  if not errorlevel 1 goto open_site
  timeout /t 1 /nobreak >nul
)
echo The Carefair server did not start. Check whether port 5173 is already in use.
pause
exit /b 1

:open_site
start "" "%SITE_URL%"
exit /b 0

:missing_runtime
echo The Codex Node.js runtime could not be found at its usual location.
echo Please contact me and I will set up another launcher for your computer.
pause
exit /b 1

:install_error
echo Package installation failed. Check your internet connection and try again.
pause
exit /b 1
