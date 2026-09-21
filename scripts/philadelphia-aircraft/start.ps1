$ErrorActionPreference = 'Stop'
$relayDir = $PSScriptRoot
$relayConfig = Get-Content -LiteralPath (Join-Path $relayDir 'config.json') -Raw | ConvertFrom-Json
try {
    $response = Invoke-WebRequest -Uri "http://127.0.0.1:$($relayConfig.port)/health" -Headers @{ Authorization = "Bearer $($relayConfig.token)" } -TimeoutSec 2 -UseBasicParsing
    if ($response.StatusCode -eq 204) { exit }
} catch {}
$stopPath = Join-Path $relayDir 'stop'
if (Test-Path -LiteralPath $stopPath) { Remove-Item -LiteralPath $stopPath }
Start-Process -FilePath $relayConfig.node -ArgumentList @('"' + (Join-Path $relayDir 'run.mjs') + '"', '"' + $relayDir + '"') -WorkingDirectory $relayDir -WindowStyle Hidden
