# Fase 7 — Terreno y Fresnel

## Objetivo

Añadir información de relieve sin confundir un DEM con un modelo urbano 3D.

La cadena queda:

```text
gNB / UE
   ↓
muestras geográficas
   ↓
elevación Copernicus DEM
   ↓
perfil del terreno
   ↓
línea directa
   +
primera zona de Fresnel
   ↓
diagnóstico de despeje
```

## Fuente de elevación

Se utiliza:

`Copernicus DEM GLO-90`

Resolución nominal:

`90 m`

Acceso mediante:

`Open-Meteo Elevation API`

La API permite hasta 100 coordenadas por solicitud.

## Muestreo

El número de muestras se adapta a la distancia:

```text
ceil(distancia / 90 m) + 1
```

limitado a:

```text
mínimo 21
máximo 100
```

Esto evita solicitar una falsa resolución mucho mayor que la del DEM.

## Línea de vista geométrica

Se construye una línea entre:

```text
elevación terreno TX + altura gNB
```

y:

```text
elevación terreno RX + altura UE
```

Luego se compara cada muestra de terreno con esa línea.

Resultado:

- `Despejada`
- `Obstruida`

### Límite

El resultado solo evalúa el terreno del DEM.

No incluye:

- edificios;
- vegetación;
- mobiliario urbano;
- vehículos.

Por eso la aplicación NO cambia automáticamente el selector LOS/NLOS de 3GPP.

## Primera zona de Fresnel

Fuente:

`ITU-R P.526-16`

Cláusula:

`Annex 1 · §2.1`

Ecuación:

```text
R1 = sqrt(lambda * d1 * d2 / (d1 + d2))
```

## Despeje del 60%

Fuente:

`ITU-R P.530-19`

Cláusula:

`Annex 1 · §2.2.2`

Se utiliza 60% de F1 como referencia visual de planificación.

No se presenta como:

- garantía universal;
- cálculo completo de difracción;
- certificación profesional.

## Curvatura y refracción

Esta fase NO incorpora todavía:

- radio terrestre efectivo;
- k-factor;
- refracción atmosférica variable;
- pérdida por difracción Bullington.

El análisis es geométrico y es especialmente útil dentro de los alcances cortos
del proyecto 5G.

Si posteriormente se requiere un enlace terrestre largo, estas variables deberán
incorporarse antes de presentar el resultado como planificación profesional.
