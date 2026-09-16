# Fase 3 — Calculadora RF + Assessment Dashboard

## Objetivo

Transformar el Radio Engine probado en una herramienta visual útil para:

- experimentar;
- detectar errores;
- comparar escenarios;
- sustentar el proyecto frente al profesor.

## Arquitectura

```text
calculadora.astro
      ↓
RadioCalculator.tsx  [client:load]
      ↓
┌──────────────┬──────────────────┐
Radio Engine   Assessment Engine
      ↓                ↓
resultados       reglas explicables
```

Astro mantiene la página y React hidrata únicamente la calculadora interactiva.

## Perfil 5G implementado

Esta fase NO pretende soportar todas las bandas NR.

Se fija un perfil controlado:

- NR band: n78;
- rango: 3300–3800 MHz;
- duplex: TDD;
- SCS usado por la calculadora: 30 kHz;
- channel bandwidths evaluados: 10, 15, 20, 25, 30, 40, 50, 60, 70, 80, 90 y 100 MHz;
- arquitectura del proyecto: SA.

Fuente técnica de banda/bandwidth:
ETSI TS 138 101-1 V18.7.0 / 3GPP TS 38.101-1 Release 18.

**SA es una decisión del proyecto**, no una consecuencia de que la banda sea n78.

## Viabilidad radio

Se usa:

`linkMargin = Prx - sensibilidad`

y se considera viable respecto a ese criterio cuando:

`linkMargin >= 0`

La sensibilidad del preset (`-90 dBm`) NO se presenta como sensibilidad universal 5G.

Es un parámetro del escenario académico y debe reemplazarse posteriormente por una especificación real cuando se seleccione un UE/CPE concreto.

## SNR

Se muestra, pero no se compara todavía con un umbral 5G universal.

No se deduce:

- CQI;
- MCS;
- QAM;
- BLER.

## IMT-2030

No existe un estado “PASS 6G final”.

Se implementa un screening:

- ITU-R M.2160 muestra 300 y 500 Mbit/s como ejemplos posibles de research target para user experienced data rate.
- La aplicación utiliza 300 Mbit/s únicamente como referencia ilustrativa.

Regla:

- si **Shannon < 300 Mbit/s**, entonces ni siquiera el límite teórico del escenario alcanza esa referencia → `FAIL` del screening;
- si **Shannon >= 300 Mbit/s**, se devuelve `CONDITIONAL`, porque Shannon no es user experienced data rate.

Esto evita una equivalencia incorrecta entre capacidad teórica y desempeño real.

## Tres demostraciones

### 1. Referencia 5G n78
Muestra un perfil compatible y RF favorable.

### 2. Distancia degradada
Cambia únicamente distancia.

Sirve para explicar:

`distancia ↑ → FSPL ↑ → Prx ↓ → SNR ↓ → margin ↓`

### 3. Fuera de n78
Mantiene RF favorable, pero cambia frecuencia a 4100 MHz.

Sirve para demostrar:

**buena señal ≠ compatibilidad con el perfil tecnológico.**
