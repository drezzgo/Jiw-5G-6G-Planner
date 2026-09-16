# Pipeline oficial del proyecto

## Fase 0 — Alcance y trazabilidad
**Objetivo:** congelar qué se construye y por qué.

Gate:
- ambos enunciados literales;
- matriz de trazabilidad completa;
- alcance y exclusiones aceptados.

## Fase 1 — Especificación matemática y base de fuentes
**Objetivo:** documentar ecuaciones, variables, unidades, rangos, fuentes y criterios.

Entregable:
- `MODEL_SPEC`;
- source registry;
- perfiles iniciales.

## Fase 2 — Radio Engine
**Objetivo:** implementar TypeScript puro y tests.

Incluye:
- FSPL;
- EIRP;
- Prx;
- noise;
- SNR;
- margin;
- Shannon;
- viability base.

## Fase 3 — Calculadora RF + Assessment Dashboard
**Objetivo:** herramienta central de sustentación.

Incluye:
- inputs;
- cálculo paso a paso;
- presets auditables;
- 5G / IMT-2030 / comparar;
- blockers;
- provenance.

## Fase 4 — Mapa Tx/Rx
**Objetivo:** configuración geográfica.

Incluye:
- MapLibre;
- Tx;
- Rx;
- distancia;
- bearing.

## Fase 5 — Propagación 5G
**Objetivo:** incorporar modelos seleccionados de 3GPP TR 38.901.

## Fase 6 — Antenas y cobertura
**Objetivo:** panel/sector/array simplificado + grid/heatmap.

## Fase 7 — Terreno (condicional)
**Objetivo:** DEM/perfil/LOS solo si aporta valor académico suficiente.

## Fase 8 — IMT-2030 experimental
**Objetivo:** comparación prospectiva basada en fuentes ITU y parámetros explícitos.

## Fase 9 — Advisor Colombia
**Objetivo:** arquitectura, equipos, QoS, seguridad, regulación y plan de pruebas.

## Fase 10 — Reporte
**Objetivo:** generar ficha técnica reproducible y apta para informe/sustentación.

## Fase 11 — Validación final
**Objetivo:** auditar matemáticas, reglas, fuentes, UI, build, documentación y casos de defensa.
