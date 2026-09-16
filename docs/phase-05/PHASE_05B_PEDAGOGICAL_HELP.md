# Fase 5B — Ayudas pedagógicas de propagación

## Objetivo

La selección de un modelo de propagación no debe exigir conocimientos previos avanzados.

La interfaz debe explicar:

- qué significa gNB;
- qué significa UE;
- qué es 5G NR;
- qué es n78;
- qué es un modelo de propagación;
- qué significa FSPL;
- diferencias entre UMi, UMa e InH;
- qué significa LOS;
- qué significa NLOS;
- qué cambia realmente al seleccionar otro modelo.

## LOS

`Line of Sight`

Se traduce en la interfaz como:

**con línea de vista**

Interpretación:

existe un trayecto directo dominante entre transmisor y receptor sin una obstrucción principal entre ambos.

No significa que no existan reflexiones.

## NLOS

`Non-Line of Sight`

Se traduce como:

**sin línea de vista**

El camino directo está bloqueado o fuertemente obstruido.

La señal puede seguir llegando mediante:

- reflexión;
- difracción;
- dispersión;
- múltiples trayectos.

En los modelos implementados, NLOS normalmente produce más pérdida que LOS.

## Modelos

### FSPL

Referencia ideal.

No modela:

- edificios;
- paredes;
- entorno urbano;
- clutter.

### UMi Street Canyon

Urban Micro.

Representa un despliegue urbano de menor escala, con la estación relativamente baja.

Perfil fijado:

- hBS = 10 m;
- hUT = 1,5 m.

### UMa

Urban Macro.

Representa una estación más alta y cobertura urbana de mayor escala.

Perfil:

- hBS = 25 m;
- hUT = 1,5 m.

### InH Office

Indoor Hotspot / Office.

Representa un escenario interior.

Perfil:

- hBS = 3 m;
- hUT = 1 m.

## Qué cambia al cambiar modelo

Solo cambia:

**la estimación de pérdida de propagación**

No cambia automáticamente:

- potencia TX;
- antena;
- ganancia;
- sensibilidad;
- frecuencia;
- ancho de banda.

Esto permite una comparación causal.

## Ayudas contextuales

Se agregan popovers con lenguaje introductorio en:

- gNB;
- UE;
- 5G NR;
- n78;
- modelo de propagación;
- FSPL;
- UMi;
- UMa;
- InH;
- LOS;
- NLOS;
- distancia 2D;
- distancia 3D;
- rumbo;
- pérdida;
- potencia recibida;
- SNR;
- margen;
- alturas del perfil.

Los popovers:

- funcionan por hover;
- funcionan por foco;
- funcionan por clic;
- se renderizan fuera del panel para evitar recortes;
- se adaptan a móvil.
