# Patch 00 — Alcance, trazabilidad y criterios de cierre

Este patch NO implementa todavía el simulador. Su propósito es congelar el alcance académico y técnico antes de escribir código.

## Rama sugerida

```powershell
git switch main
git pull origin main
git switch -c chore/phase00-scope
```

## Aplicación del patch

Desde la raíz del repositorio:

```powershell
Expand-Archive `
  -Path "$HOME\Downloads\jiw-planner-phase00-scope-overlay.zip" `
  -DestinationPath "." `
  -Force
```

## Validación

```powershell
git status
git diff --check
git diff --stat
```

Este patch solo añade documentación, por lo que no debe cambiar dependencias ni romper `pnpm build`.

Si el proyecto Astro ya existe:

```powershell
pnpm build
```

## Cierre de Fase 0

La Fase 0 NO se considera cerrada hasta que:

1. Se copie literalmente el enunciado A del profesor en `REQUIREMENTS_BASELINE.md`.
2. Se confirme que ambos enunciados son obligatorios.
3. Cada fragmento de ambos enunciados tenga al menos una funcionalidad o entregable asociado en `TRACEABILITY_MATRIX.md`.
4. El alcance y exclusiones sean aceptados.
5. No exista ninguna funcionalidad del MVP que no pueda justificarse por un requisito.
6. La distinción `5G NR estandarizado` vs `IMT-2030 experimental` quede explícita.

## Commit sugerido

```powershell
git add docs PATCH_INSTRUCTIONS.md
git commit -m "docs: define phase 0 scope and traceability"
git push -u origin chore/phase00-scope
```
