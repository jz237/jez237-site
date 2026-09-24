param([switch]$Watchdog)
$ErrorActionPreference = 'Stop'
$relayDir = $PSScriptRoot
$stopPath = Join-Path $relayDir 'stop'
# Scheduled recovery must never override the user's Stop shortcut.
if ($Watchdog -and (Test-Path -LiteralPath $stopPath)) { exit }
$relayMutex = New-Object System.Threading.Mutex($false, 'Local\PhiladelphiaReliefAircraftStart')
if (-not $relayMutex.WaitOne(0)) { $relayMutex.Dispose(); exit }
try {
$relayConfig = Get-Content -LiteralPath (Join-Path $relayDir 'config.json') -Raw | ConvertFrom-Json
try {
    $response = Invoke-WebRequest -Uri "http://127.0.0.1:$($relayConfig.port)/health" -Headers @{ Authorization = "Bearer $($relayConfig.token)" } -TimeoutSec 2 -UseBasicParsing
    if ($response.StatusCode -eq 204) { exit }
} catch {}
if (Test-Path -LiteralPath $stopPath) { Remove-Item -LiteralPath $stopPath }
Start-Process -FilePath $relayConfig.node -ArgumentList @('"' + (Join-Path $relayDir 'run.mjs') + '"', '"' + $relayDir + '"') -WorkingDirectory $relayDir -WindowStyle Hidden
# Hold the launch lock through startup so simultaneous sign-in/task calls cannot
# create two helpers before either has bound its local port.
Start-Sleep -Seconds 3
} finally { $relayMutex.ReleaseMutex(); $relayMutex.Dispose() }
