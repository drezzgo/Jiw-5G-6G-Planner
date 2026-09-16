# Patch 06B — Worker oficial de MapLibre para Vite

Este patch corrige el warning:

```text
maplibre-gl-worker.mjs ... optimize deps directory ... file does not exist
```

siguiendo la integración documentada por MapLibre GL JS para Vite.

## Aplicar

Primero detén `pnpm dev` con `Ctrl+C`.

```powershell
Expand-Archive `
  -Path "S:\Downloads\jiw-planner-phase06b-maplibre-worker-fix.zip" `
  -DestinationPath "." `
  -Force
```

Limpia únicamente la caché generada por Vite:

```powershell
Remove-Item -Recurse -Force .\node_modules\.vite -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force .\.astro -ErrorAction SilentlyContinue
```

No borres `node_modules` completo.

## Validar

```powershell
pnpm exec vitest run
pnpm build
pnpm dev
```

Después abre:

```text
http://localhost:4321/planner
```

Prueba:

- mapa base;
- marcadores;
- línea gNB → UE;
- generar cobertura.

El warning de `maplibre-gl-worker.mjs` ya no debería aparecer.

El warning de chunks > 500 kB es otro asunto y puede permanecer.
