$ErrorActionPreference = 'Stop'
$relayDir = Join-Path $env:USERPROFILE '.philadelphia-relief-aircraft'
if (-not (Test-Path -LiteralPath (Join-Path $relayDir 'config.json'))) {
    throw 'Install the private aircraft relay first.'
}
# The task runs only in this user's interactive session, without elevation,
# stored passwords, or waking a sleeping computer. Stop remains authoritative.
$taskName = 'Philadelphia Relief Aircraft Recovery'
$userId = [System.Security.Principal.WindowsIdentity]::GetCurrent().Name
$config = Get-Content -LiteralPath (Join-Path $relayDir 'config.json') -Raw | ConvertFrom-Json
# A tiny Windows Script Host launcher avoids PowerShell profile/startup problems
# in Task Scheduler and guarantees the Node health check has no console window.
$nodeCommand = '"' + $config.node + '" "' + (Join-Path $relayDir 'watchdog.mjs') + '" "' + $relayDir + '"'
$launcher = 'Set shell = CreateObject("WScript.Shell")' + "`r`n" + 'WScript.Quit shell.Run("' + $nodeCommand.Replace('"', '""') + '", 0, True)'
$launcherPath = Join-Path $relayDir 'watchdog.vbs'
Set-Content -LiteralPath $launcherPath -Value $launcher -Encoding Unicode
$action = New-ScheduledTaskAction -Execute (Join-Path $env:WINDIR 'System32\wscript.exe') -Argument ('//B //Nologo "' + $launcherPath + '"')
$trigger = @(
    (New-ScheduledTaskTrigger -Once -At (Get-Date).AddMinutes(1) -RepetitionInterval (New-TimeSpan -Minutes 2)),
    (New-ScheduledTaskTrigger -AtLogOn -User $userId)
)
$settings = New-ScheduledTaskSettingsSet -AllowStartIfOnBatteries -DontStopIfGoingOnBatteries -StartWhenAvailable -MultipleInstances IgnoreNew -Priority 4 -ExecutionTimeLimit (New-TimeSpan -Minutes 1)
$principal = New-ScheduledTaskPrincipal -UserId $userId -LogonType Interactive -RunLevel Limited
Register-ScheduledTask -TaskName $taskName -Action $action -Trigger $trigger -Settings $settings -Principal $principal -Description 'Recover the private Philadelphia aircraft helper after unexpected exit; respect its Stop shortcut.' -Force | Out-Null
Write-Output 'Aircraft recovery installed: every two minutes while signed in; manual Stop is respected.'
