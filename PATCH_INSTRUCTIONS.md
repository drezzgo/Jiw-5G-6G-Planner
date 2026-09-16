# Patch 03E — Cierre de Fase 3

Aplicar SOBRE la Fase 3D.

Corrige:

- tipografía de los popovers renderizados por portal;
- tipografía de extractos documentales de ETSI/3GPP y MinTIC;
- presentación de citas regulatorias;
- añade sustitución numérica debajo de cada fórmula.

## Aplicar

```powershell
Expand-Archive `
  -Path "S:\Downloads\jiw-planner-phase03-final-polish-overlay.zip" `
  -DestinationPath "." `
  -Force
```

## Validar

```powershell
pnpm exec vitest run
pnpm build
pnpm dev
```

## Comprobación manual

1. Abrir varios `?` y verificar tipografía sans-serif uniforme.
2. Abrir respaldo documental de n78/TDD y revisar extractos.
3. Activar `Modo sustentación`.
4. Abrir `Ver desarrollo del cálculo`.
5. Verificar que cada paso muestre:
   - fórmula general;
   - sustitución numérica;
   - resultado;
   - explicación.
6. Cambiar un valor de entrada y recalcular.
7. Confirmar que la sustitución se actualiza con el nuevo escenario.

## Si todo pasa

```powershell
git status
git diff --check
git add .
git commit -m "feat: finalize phase 3 calculator UX and auditable calculations"
git push -u origin feat/phase03-calculator-assessment
```
