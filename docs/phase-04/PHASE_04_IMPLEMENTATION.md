# Fase 4 — Mapa gNB/UE

## Objetivo

Transformar coordenadas geográficas en entradas reproducibles para el Radio Engine.

La cadena queda:

```text
gNB en mapa
     +
UE en mapa
     ↓
latitud / longitud
     ↓
distancia + rumbo
     ↓
distanceM
     ↓
Radio Engine
     ↓
FSPL / Prx / SNR / margen
```

## MapLibre GL JS

Se utiliza MapLibre GL JS como motor de mapa.

La integración se mantiene dentro de un único componente React:

`MapPlanner.tsx`

Astro monta ese componente como:

`client:only="react"`

porque MapLibre depende del navegador y del DOM.

## Mapa base

Se usa una fuente raster de OpenStreetMap con atribución visible.

Esto es apropiado para el prototipo académico.

Para un despliegue con tráfico significativo deberá revisarse la política del proveedor de teselas y seleccionarse infraestructura cartográfica apropiada.

## Coordenadas iniciales

La página abre sobre un ejemplo académico en Bogotá.

Estas coordenadas son solo el escenario inicial del proyecto.

La aplicación:

- no solicita ubicación GPS del usuario;
- no usa geolocalización del navegador;
- no interpreta esas coordenadas como ubicación real del estudiante.

## Distancia

La Fase 4 usa Haversine sobre una Tierra esférica simplificada.

Supuesto del proyecto:

`R = 6 371 008.8 m`

La salida es una aproximación de distancia de círculo máximo entre las coordenadas.

### No incluye

- elevación;
- altura de antenas;
- terreno;
- edificios;
- trayectoria 3D.

Estos elementos pertenecen a fases posteriores.

## Rumbo

Se calcula el rumbo geográfico inicial:

- 0° norte;
- 90° este;
- 180° sur;
- 270° oeste.

Más adelante será útil para:

- orientación de antenas;
- azimuth;
- ganancia efectiva;
- patrones sectoriales.

En Fase 4 todavía NO altera la ganancia de antena.

## Integración RF

El mapa reutiliza:

`N78_REFERENCE`

de la Fase 3.

Solo sustituye:

`distanceM`

con la distancia calculada desde el mapa.

Esto es intencional: permite comprobar que el mapa es únicamente una nueva fuente de entrada y no una segunda implementación del presupuesto de enlace.
