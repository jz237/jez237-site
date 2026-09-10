$gameRoot = $PSScriptRoot
$gameUrl = 'http://127.0.0.1:4174/race.html'
$gameReady = $false
try { $gameResponse = Invoke-WebRequest -Uri $gameUrl -TimeoutSec 2; $gameReady = $gameResponse.Content -match 'After the Storm' } catch {}
if (-not $gameReady) {
  $nodePath = (Get-Command node -ErrorAction Stop).Source
  Start-Process -FilePath $nodePath -ArgumentList 'server.mjs' -WorkingDirectory $gameRoot -WindowStyle Hidden
  for ($attempt = 0; $attempt -lt 30; $attempt++) {
    Start-Sleep -Milliseconds 200
    try { $gameResponse = Invoke-WebRequest -Uri $gameUrl -TimeoutSec 1; if ($gameResponse.Content -match 'After the Storm') { $gameReady = $true; break } } catch {}
  }
}
if ($gameReady) { Start-Process $gameUrl } else { Write-Error 'Could not start the game. Try npm start from the game folder.'; Read-Host 'Press Enter to close' }
