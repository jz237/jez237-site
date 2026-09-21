$ErrorActionPreference = 'Stop'
Set-Content -LiteralPath (Join-Path $PSScriptRoot 'stop') -Value 'stop'
