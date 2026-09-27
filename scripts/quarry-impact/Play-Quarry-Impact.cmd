@echo off
cd /d "%~dp0"
powershell -NoProfile -ExecutionPolicy Bypass -Command "$taskPort = Get-NetTCPConnection -LocalPort 8795 -State Listen -ErrorAction SilentlyContinue; if (-not $taskPort) { Start-Process -FilePath 'node.exe' -ArgumentList 'serve.mjs' -WorkingDirectory '%~dp0' -WindowStyle Hidden }; Start-Process 'http://127.0.0.1:8795'"
