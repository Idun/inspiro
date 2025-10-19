@echo off
REM To use this file, rename it from "start-app.txt" to "start-app.bat" and then double-click it.
REM This script requires Node.js and npm to be installed on your system.

echo =========================================
echo  InspirationVault Application Launcher
echo =========================================
echo.

echo [Step 1] Installing required packages via 'npm install'...
call npm install
if %errorlevel% neq 0 (
    echo.
    echo ERROR: Failed to install packages. Please ensure Node.js and npm are installed correctly.
    pause
    exit /b
)

echo.
echo [Step 2] Starting the development server via 'npm run dev'...
start "InspirationVault Server" cmd /c "npm run dev"

echo.
echo [Step 3] Opening http://localhost:3000/ in your browser...
REM Give the server a moment to start up before opening the browser.
timeout /t 5 /nobreak > nul
start "" "http://localhost:3000/"
