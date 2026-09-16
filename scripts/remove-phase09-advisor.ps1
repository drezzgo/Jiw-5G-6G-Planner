$ErrorActionPreference = "Stop"

Write-Host "Removing Phase 9 Advisor artifacts..." -ForegroundColor Cyan

$targets = @(
  ".\src\pages\asesor.astro",
  ".\src\components\react\advisor",
  ".\src\core\advisor",
  ".\src\knowledge\advisor-evidence.ts",
  ".\tests\advisor",
  ".\docs\phase-09"
)

foreach ($target in $targets) {
  if (Test-Path $target) {
    Remove-Item -Recurse -Force $target
    Write-Host "Removed: $target" -ForegroundColor Green
  } else {
    Write-Host "Already absent: $target" -ForegroundColor DarkGray
  }
}

Write-Host ""
Write-Host "Phase 9 Advisor removed. Phase 8 remains the functional scope." -ForegroundColor Green
