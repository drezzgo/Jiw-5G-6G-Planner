# Fase 2 — Radio Engine

## Objetivo

Implementar las ecuaciones de Fase 1 como funciones puras TypeScript, sin depender de Astro, React ni MapLibre.

## Diseño

La capa queda dividida en funciones pequeñas:

- `calculateFsplDb`
- `calculateEirpDbm`
- `calculateReceivedPowerDbm`
- `calculateThermalNoiseDbm`
- `calculateSnrDb`
- `calculateLinkMarginDb`
- `calculateShannonCapacityBps`
- `calculateLinkBudget`

## Justificación

### Funciones pequeñas

Permiten probar por separado:

- fórmula;
- unidades;
- signos;
- validaciones.

### Orquestador separado

`calculateLinkBudget()` compone las funciones, pero no contiene una segunda versión de las ecuaciones.

Esto evita duplicación.

### Sin UI

La misma lógica podrá ser consumida posteriormente por:

- calculadora;
- mapa;
- coverage worker;
- reportes;
- tests.

### Sin “cumplimiento”

El Radio Engine devuelve resultados físicos/matemáticos.

El Assessment Engine, en otra capa, decidirá si un criterio:

- pasa;
- falla;
- es condicional;
- no puede evaluarse.

## Limitaciones actuales

El engine todavía usa FSPL como propagación.

No incluye:

- UMi;
- UMa;
- Indoor;
- interferencia;
- shadow fading;
- MIMO;
- MCS;
- beam management;
- terreno;
- clutter.

Estas limitaciones son intencionales en esta fase.
