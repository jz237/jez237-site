$ErrorActionPreference='Stop'
$base='D:/Projects/hidden reef header'
$active=@(Get-CimInstance Win32_Process | Where-Object {$_.Name -eq 'node.exe' -and $_.CommandLine -match 'deploy_jez237_pages|pages deploy'})
if($active.Count){throw 'An active deployment must finish before storage cleanup'}
$stages=@(Get-ChildItem -LiteralPath "$base/work" -Directory | Where-Object {$_.Name -like 'quarry-*-public-*' -and (Test-Path -LiteralPath "$($_.FullName)/index.html") -and (Test-Path -LiteralPath "$($_.FullName)/_headers") -and (Test-Path -LiteralPath "$($_.FullName)/games") -and -not (Test-Path -LiteralPath "$($_.FullName)/.git")} | Sort-Object CreationTimeUtc -Descending)
$backups=@(Get-ChildItem -LiteralPath $base -Directory | Where-Object {$_.Name -like 'quarry-backup-before-*'} | Sort-Object CreationTimeUtc -Descending)
$targets=@($stages | Select-Object -Skip 1)+@($backups | Select-Object -Skip 1)
$before=(Get-PSDrive D).Free
$bytes=[long]0
$removed=@()
foreach($dir in $targets){
 if($dir.Attributes -band [IO.FileAttributes]::ReparsePoint){throw "Refusing linked directory: $($dir.FullName)"}
 $items=@(Get-ChildItem -LiteralPath $dir.FullName -Recurse -Force)
 if(@($items | Where-Object {$_.Attributes -band [IO.FileAttributes]::ReparsePoint}).Count){throw "Refusing tree with links: $($dir.FullName)"}
 $size=($items | Where-Object {-not $_.PSIsContainer} | Measure-Object -Property Length -Sum).Sum
 Remove-Item -LiteralPath $dir.FullName -Recurse -Force
 if(Test-Path -LiteralPath $dir.FullName){throw "Cleanup incomplete: $($dir.FullName)"}
 $bytes+=$size;$removed+=$dir.FullName
 Write-Output "Removed $($dir.Name) ($size bytes)"
}
$result=[pscustomobject]@{removedStageCount=[Math]::Max(0,$stages.Count-1);removedBackupCount=[Math]::Max(0,$backups.Count-1);removedBytes=$bytes;freeBefore=$before;freeAfter=(Get-PSDrive D).Free;retainedStage=$stages[0].FullName;retainedBackup=$backups[0].FullName;removed=$removed}
$result|ConvertTo-Json -Depth 4|Set-Content -LiteralPath "$base/work/quarry-storage-cleanup-latest.json" -Encoding UTF8
$result|Select-Object -Property * -ExcludeProperty removed|ConvertTo-Json
