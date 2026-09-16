$ErrorActionPreference = "Stop"

function Write-Section($title) {
  Write-Host ""
  Write-Host "=== $title ===" -ForegroundColor Cyan
}

function Assert-Exists($path) {
  if (-not (Test-Path $path)) {
    throw "Falta archivo requerido: $path"
  }

  Write-Host "OK  $path" -ForegroundColor Green
}

function Assert-Absent($path) {
  if (Test-Path $path) {
    throw "El archivo o directorio no deberia existir: $path"
  }

  Write-Host "OK  ausente: $path" -ForegroundColor Green
}

Write-Section "Estructura final"

Assert-Exists ".\src\pages\index.astro"
Assert-Exists ".\src\pages\calculadora.astro"
Assert-Exists ".\src\pages\planner.astro"
Assert-Exists ".\src\pages\imt2030.astro"

Assert-Absent ".\src\pages\asesor.astro"
Assert-Absent ".\src\components\react\advisor"
Assert-Absent ".\src\core\advisor"

Write-Section "Busqueda de terminos que no deben quedar en la UI"

$srcFiles = Get-ChildItem ".\src" -Recurse -File |
  Where-Object {
    $_.Extension -in @(".astro", ".tsx", ".ts", ".css")
  }

$forbidden = @(
  "Asesor Colombia",
  "6G NR",
  "cumple IMT-2030",
  "certificado IMT-2030"
)

foreach ($term in $forbidden) {
  $matches = $srcFiles | Select-String -SimpleMatch $term

  if ($matches) {
    Write-Host ""
    Write-Host "Se encontro '$term' en:" -ForegroundColor Yellow

    $matches | ForEach-Object {
      Write-Host "  $($_.Path):$($_.LineNumber)"
    }

    throw "Revisar termino no deseado: $term"
  }

  Write-Host "OK  no aparece: $term" -ForegroundColor Green
}

Write-Section "Git diff check"

git diff --check

if ($LASTEXITCODE -ne 0) {
  throw "git diff --check encontro problemas."
}

Write-Section "Tests"

pnpm exec vitest run

if ($LASTEXITCODE -ne 0) {
  throw "Los tests fallaron."
}

Write-Section "Build"

pnpm build

if ($LASTEXITCODE -ne 0) {
  throw "El build fallo."
}

Write-Host ""
Write-Host "VALIDACION FINAL AUTOMATIZADA: OK" -ForegroundColor Green
Write-Host "Continua con la revision manual de docs/phase-11/FINAL_VALIDATION.md"
