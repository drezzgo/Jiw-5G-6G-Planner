# Rendimiento y warning de chunks

## Warning observado

Vite informó:

`Some chunks are larger than 500 kB after minification`

Esto es un warning, no un fallo de compilación.

No debemos resolverlo simplemente aumentando:

`chunkSizeWarningLimit`

porque eso solo oculta el síntoma.

## Cambios de Fase 6

### MapLibre

Antes:

`import { Map, Marker, Popup } from 'maplibre-gl'`

Ahora MapLibre se obtiene mediante:

`await import('maplibre-gl')`

El objetivo es separar el código cartográfico del módulo principal de React.

### Cobertura

La cuadrícula se calcula en:

`coverage.worker.ts`

Vite construye el Worker como recurso separado.

Esto protege el hilo principal aunque aumentemos el número de celdas.

## Si el warning permanece

No asumir automáticamente que existe un problema.

MapLibre es una dependencia cartográfica considerable y un chunk asíncrono puede
continuar superando el umbral informativo.

Astro recomienda analizar primero qué contiene el bundle utilizando
`rollup-plugin-visualizer`.

Flujo recomendado antes de cambiar límites:

1. medir;
2. identificar el chunk;
3. comprobar qué dependencia lo produce;
4. decidir si requiere optimización real.

No añadimos el visualizador al proyecto de producción durante esta fase porque es
una herramienta de diagnóstico, no una dependencia funcional.
