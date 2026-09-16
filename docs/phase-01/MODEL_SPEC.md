# MODEL_SPEC — Contrato matemático del motor RF

## 1. Objetivo

Este documento define el comportamiento matemático que deberá implementar `src/core/radio` en la Fase 2.

La interfaz NO puede modificar las ecuaciones.
React solo suministrará entradas y mostrará resultados.

---

# 2. Convención de unidades

Internamente se usarán unidades explícitas:

| Magnitud | Unidad interna |
|---|---|
| Frecuencia | Hz |
| Distancia | m |
| Bandwidth | Hz |
| Temperatura | K |
| Potencia TX/RX | dBm |
| Ganancias | dBi |
| Pérdidas | dB |
| Noise figure | dB |
| SNR | dB |
| Capacidad | bit/s |

La UI podrá aceptar MHz, GHz, km o Mbps, pero convertirá a estas unidades antes de llamar al Core.

## Regla

Nunca se recibe un `number` ambiguo llamado simplemente `frequency` o `distance`.

---

# 3. Constantes

## Velocidad de la luz

Para la implementación se utilizará:

`c = 299 792 458 m/s`

## Constante de Boltzmann

`k = 1.380649 × 10^-23 J/K`

Su valor es exacto en el SI moderno.

Fuente registrada: `NIST_BOLTZMANN`.

---

# 4. Free-Space Path Loss

## Función

Calcular la pérdida básica de transmisión en espacio libre.

La Recomendación ITU-R P.525-5 proporciona:

`Lbf = 20 log10(4πd/λ)`

con `d` y `λ` en la misma unidad.

Usando frecuencia:

`λ = c/f`

por tanto, internamente:

`FSPL_dB = 20 log10(4π d_m f_Hz / c)`

La forma práctica de ITU-R P.525-5 es:

`Lbf = 32.4 + 20 log10(f_MHz) + 20 log10(d_km)`

La constante `32.4` está redondeada en la recomendación. Para cálculo interno se utilizará la forma física con `c`.

## Dominio

- `distanceM > 0`
- `frequencyHz > 0`

## Salida

`pathLossDb`

## Fuente

`ITU_R_P_525_5_2024`

## Limitación

FSPL supone espacio libre ideal. Es baseline, no modelo realista de ciudad.

---

# 5. EIRP

## Función

Representar la potencia isotrópicamente radiada equivalente en la dirección evaluada.

`EIRP_dBm = Ptx_dBm + Gtx_dBi - Ltx_dB`

## Entradas

- potencia del transmisor;
- ganancia efectiva TX;
- pérdidas TX.

## Salida

`eirpDbm`

## Clasificación

Cálculo de presupuesto de enlace.

## Advertencia

La ganancia futura podrá ser direccional y depender del azimuth relativo. En Fase 2 se utilizará la ganancia efectiva suministrada como entrada.

---

# 6. Potencia recibida

`Prx_dBm = EIRP_dBm - PathLoss_dB + Grx_dBi - Lrx_dB`

## Entradas

- EIRP;
- path loss;
- ganancia RX;
- pérdidas RX.

## Salida

`receivedPowerDbm`

## Limitación

No representa por sí sola conectividad NR.

---

# 7. Ruido térmico

En lugar de codificar mágicamente `-174 dBm/Hz`, el motor partirá de:

`N_W = k T B`

y añadirá la figura de ruido del receptor.

En dBm:

`Noise_dBm = 10 log10(k T B / 1 mW) + NF_dB`

## Entradas

- `temperatureK`;
- `bandwidthHz`;
- `noiseFigureDb`.

## Default del escenario académico

`temperatureK = 290 K`

A 290 K la densidad térmica resultante es aproximadamente:

`-173.975 dBm/Hz`

Por eso suele aproximarse como `-174 dBm/Hz`.

## Salida

`noisePowerDbm`

## Fuentes

- `NIST_BOLTZMANN`
- teoría térmica de ruido.

## Limitación

Este modelo no representa toda interferencia real de una red móvil.

---

# 8. SNR

`SNR_dB = Prx_dBm - Noise_dBm`

## Salida

`snrDb`

## Importante

La aplicación NO supondrá que un SNR concreto implica automáticamente una modulación o MCS NR.

Eso requeriría un modelo adicional documentado.

---

# 9. Link Margin

`Margin_dB = Prx_dBm - Sensitivity_dBm`

Solo se calcula cuando exista una sensibilidad de receptor válida.

## Salida

`linkMarginDb`

## Importante

La sensibilidad debe provenir de:

- especificación aplicable;
- fabricante;
- perfil experimental explícito.

No habrá una sensibilidad universal inventada para “5G”.

---

# 10. Capacidad teórica de Shannon

Conversión:

`SNR_linear = 10^(SNR_dB / 10)`

Capacidad:

`C_bps = B_Hz × log2(1 + SNR_linear)`

## Fuente

`SHANNON_1948`

## Interpretación

Es un límite teórico de capacidad de canal bajo las hipótesis del modelo.

## Prohibido en la UI

No mostrar:

`Throughput real 5G = C`

Debe mostrarse:

`Capacidad teórica de Shannon`.

---

# 11. Viabilidad radio

No se fija un umbral universal de SNR.

La evaluación recibe criterios explícitos.

Ejemplo conceptual:

- si existe sensibilidad: `Prx >= sensitivity`;
- si existe `minSnrDb`: `SNR >= minSnr`;
- si existe `minMarginDb`: `margin >= minMargin`.

Cada threshold deberá incluir:

- valor;
- unidad;
- fuente;
- tipo de fuente.

Si falta un criterio indispensable, el sistema debe poder devolver:

`NOT_EVALUABLE`

en vez de inventar una conclusión.

---

# 12. Separación de resultados

El Core devolverá hechos:

- path loss;
- EIRP;
- Prx;
- noise;
- SNR;
- margin;
- Shannon.

El Assessment Engine devolverá interpretaciones:

- PASS;
- FAIL;
- CONDITIONAL;
- NOT_EVALUABLE.

No se mezclan.

---

# 13. Propagación 3GPP

Los escenarios UMi, UMa e Indoor se implementarán en una fase posterior a partir de 3GPP TR 38.901.

Fuente seleccionada para fijar posteriormente las fórmulas:

`3GPP_TR_38_901_R19_4_0`

La versión 19.4.0 aparece publicada por 3GPP el 23 de junio de 2026.

No copiar fórmulas de memoria: se extraerán y documentarán por escenario antes de codificarlas.

---

# 14. Condiciones de error

El Core debe rechazar:

- frecuencia <= 0;
- distancia <= 0;
- bandwidth <= 0;
- temperatura <= 0;
- NaN;
- Infinity.

No debe devolver silenciosamente `NaN` o `Infinity`.

---

# 15. Precisión

Los cálculos internos utilizarán `number` de JavaScript/TypeScript.

La UI redondeará solo para presentación.

Los tests compararán con tolerancias explícitas.
