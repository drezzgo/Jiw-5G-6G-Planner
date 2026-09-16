# Fase 6 — Antenas direccionales y cobertura

## Objetivo

Introducir dirección de antena y evaluación espacial de múltiples puntos sin convertir
el proyecto en un simulador MIMO completo.

---

# 1. Dos modelos de antena

## Ganancia fija

Mantiene:

`Gtx = 15 dBi`

del escenario académico de referencia.

La dirección no modifica la ganancia.

Clasificación:

`PROJECT_PARAMETER`

Sirve para:

- comparar con fases anteriores;
- aislar el efecto de propagación;
- mantener un baseline reproducible.

## Elemento direccional 3GPP

Se implementa el patrón de potencia de un **solo elemento de antena** de:

`3GPP TR 38.901 v19.4.0`

Ubicación:

- cláusula 7.3;
- tabla 7.3-1;
- página PDF 29.

Parámetros:

- ancho de haz vertical: 65°;
- ancho de haz horizontal: 65°;
- atenuación vertical máxima: 30 dB;
- atenuación máxima combinada: 30 dB;
- ganancia direccional máxima del elemento: 8 dBi.

## Advertencia

Esto NO es:

- un arreglo Massive MIMO completo;
- array factor;
- precodificación;
- beam management;
- selección dinámica de beams.

La interfaz lo denomina:

**Elemento direccional 3GPP de referencia**

y no “antena 5G óptima”.

---

# 2. Azimut

Convención:

- 0° norte;
- 90° este;
- 180° sur;
- 270° oeste.

Se calcula:

`offsetHorizontal = bearingUE - azimuthAntena`

normalizado a:

`[-180°, +180°]`.

---

# 3. Downtilt

El downtilt se expresa como inclinación positiva hacia abajo.

Primero:

`depresión = atan2(hBS - hUT, d2D)`

Luego:

`offsetVertical = depresión - downtilt`

Cuando ambos coinciden, el UE está sobre la dirección vertical principal del patrón.

---

# 4. Ganancia efectiva

Para el elemento 3GPP:

```text
offset horizontal
        +
offset vertical
        ↓
patrón 3GPP
        ↓
atenuación
        ↓
Gtx efectiva
        ↓
EIRP
        ↓
Prx
```

Por tanto Fase 6 es la primera en la que la orientación de la antena modifica
directamente el presupuesto del enlace.

---

# 5. Cuadrícula de cobertura

No se calcula un solo UE.

La herramienta crea múltiples celdas alrededor de la gNB.

Para cada celda:

1. calcula coordenada;
2. calcula distancia;
3. calcula bearing;
4. calcula ganancia efectiva de antena;
5. calcula propagación;
6. calcula Prx;
7. calcula SNR;
8. calcula margen;
9. clasifica respecto a la sensibilidad configurada.

Colores:

- verde: margen >= 10 dB;
- naranja: 0 <= margen < 10 dB;
- rojo: margen < 0 dB;
- gris: modelo no evaluable.

Los límites visuales de 10 dB NO se presentan como umbrales 3GPP universales.
El criterio básico de viabilidad continúa siendo la sensibilidad configurada.

---

# 6. Web Worker

La cuadrícula se calcula fuera del hilo principal.

Motivo:

una cuadrícula 41 x 41 puede requerir más de mil evaluaciones independientes.

El Worker evita que:

- arrastrar el mapa;
- abrir controles;
- interactuar con React

quede bloqueado durante el cálculo.

---

# 7. Alcance

La cobertura NO incluye todavía:

- terreno;
- DEM;
- edificios reales;
- clutter geográfico;
- handover;
- interferencia intercelda;
- scheduler;
- MIMO completo;
- tráfico.

Debe describirse como:

**mapa académico de cobertura calculada bajo el modelo configurado**.
