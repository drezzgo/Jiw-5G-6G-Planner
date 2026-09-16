# Casos matemáticos de validación

Estos NO son presets normativos de 5G.

Son casos de prueba matemáticos que deberán pasar antes de construir la calculadora.

---

## V-001 — FSPL

Entradas:

- distancia = 1000 m;
- frecuencia = 1 GHz.

Con la forma exacta:

`20 log10(4πdf/c)`

Resultado esperado:

`≈ 92.447783 dB`

Tolerancia sugerida:

`± 0.0001 dB`

Propósito:

detectar errores de Hz/MHz y m/km.

---

## V-002 — Densidad de ruido térmico

Entradas:

- T = 290 K;
- B = 1 Hz;
- NF = 0 dB.

Resultado esperado:

`≈ -173.975187 dBm`

Propósito:

demostrar de dónde sale la aproximación habitual de `-174 dBm/Hz`.

---

## V-003 — Ruido en 100 MHz

Entradas:

- T = 290 K;
- B = 100 MHz;
- NF = 7 dB.

Resultado esperado:

`≈ -86.975187 dBm`

---

## V-004 — Shannon

Entradas:

- bandwidth = 100 MHz;
- SNR = 10 dB.

Conversión:

`SNRlinear = 10`

Resultado esperado:

`≈ 345.943162 Mbit/s`

Importante:

el test valida la ecuación, no rendimiento NR real.

---

## V-005 — Link budget algebraico

Entradas:

- Ptx = 30 dBm;
- Gtx = 15 dBi;
- Ltx = 2 dB;
- PathLoss = 100 dB;
- Grx = 0 dBi;
- Lrx = 1 dB.

EIRP esperado:

`43 dBm`

Prx esperado:

`-58 dBm`

Propósito:

detectar signos invertidos en ganancias y pérdidas.

---

# Caso que NO se define todavía

No se crea todavía:

`5G_VALID_REFERENCE`

porque para hacerlo correctamente debemos fijar:

- banda/perfil;
- equipo o condición de referencia;
- sensibilidad;
- criterios de assessment;
- procedencia de cada threshold.

Ese preset se construirá después de cerrar las reglas correspondientes.
