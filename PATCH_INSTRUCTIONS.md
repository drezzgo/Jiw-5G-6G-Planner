# Patch 02 — Radio Engine

Esta fase implementa el núcleo matemático puro en TypeScript y sus pruebas automatizadas.

No añade UI, mapa, presets 5G normativos ni reglas IMT-2030.

## 1. Rama

```powershell
git switch main
git pull origin main
git switch -c feat/phase02-radio-engine
```

## 2. Dependencia de pruebas

```powershell
pnpm add -D vitest
```

## 3. Aplicar patch

```powershell
Expand-Archive `
  -Path "S:\Downloads\jiw-planner-phase02-radio-engine-overlay.zip" `
  -DestinationPath "." `
  -Force
```

Ajusta la ruta del ZIP si corresponde.

## 4. Ejecutar pruebas

```powershell
pnpm exec vitest run
```

## 5. Validar Astro

```powershell
pnpm build
```

## 6. Validar Git

```powershell
git status
git diff --check
git diff --stat
```

## 7. Commit

```powershell
git add .
git commit -m "feat: implement tested radio link budget engine"
git push -u origin feat/phase02-radio-engine
```

## Gate de salida

No pasar a la calculadora React hasta que:

- todos los tests pasen;
- `pnpm build` pase;
- no exista lógica RF dentro de componentes UI;
- las salidas coincidan con los casos matemáticos definidos en Fase 1.
