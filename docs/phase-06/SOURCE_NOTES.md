# Evidencia técnica — Fase 6

Verificación: 2026-09-16.

## Fuente

**ETSI TR 138 901 V19.4.0 (2026-07)**  
**3GPP TR 38.901 version 19.4.0 Release 19**

Documento:

https://www.etsi.org/deliver/etsi_tr/138900_138999/138901/19.04.00_60/tr_138901v190400p.pdf

## Patrón de antena

Ubicación:

- cláusula 7.3;
- figura 7.3-1;
- tabla 7.3-1;
- página PDF 29.

La tabla define para un elemento:

- corte vertical;
- corte horizontal;
- patrón 3D combinado;
- ganancia máxima `GE,max = 8 dBi`.

Valores usados:

- theta3dB = 65°;
- phi3dB = 65°;
- SLAV = 30 dB;
- Amax = 30 dB.

## Interpretación

La fuente describe un **single antenna element** dentro del modelo de panel/array.

Nuestro proyecto NO extiende esa tabla para afirmar que:

- 8 dBi sea la ganancia total de toda gNB real;
- un panel comercial tenga exactamente ese patrón;
- un Massive MIMO completo sea equivalente a un solo elemento.

El perfil se utiliza para demostrar direccionalidad de forma trazable.
