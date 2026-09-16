# Cierre visual y matemático de Fase 3

## Problema 1 — Tipografía en popovers

Los popovers se renderizan mediante un portal en `document.body`.

Por ello no heredaban necesariamente las variables CSS ni la familia tipográfica
de `.radio-calculator`.

### Corrección

El portal ahora declara explícitamente:

- variables de color;
- tipografía sans-serif;
- pesos;
- estilo normal;
- `box-sizing`.

Esto evita que algunos navegadores caigan en la tipografía serif por defecto.

## Problema 2 — Citas documentales

Los extractos de ETSI/3GPP y MinTIC se mostraban con tipografía serif e itálica.

Se cambia a una presentación uniforme:

- sans-serif;
- fondo documental suave;
- borde lateral;
- texto normal;
- mejor interlineado.

La cita continúa diferenciándose visualmente sin parecer texto roto.

## Problema 3 — Fórmula sin sustitución

La fórmula general no basta para auditar un cálculo durante una sustentación.

Cada paso ahora muestra tres niveles:

1. fórmula general;
2. sustitución de los valores del escenario actual;
3. resultado.

Ejemplo:

`PIRE = Ptx + Gtx − Ltx`

seguido de:

`30 dBm + 15 dBi − 2 dB = 43 dBm`

Esto permite que el profesor o la clase reproduzcan el cálculo manualmente.

## Regla de precisión

- Los valores de entrada se muestran con la precisión necesaria.
- Los resultados visibles se redondean para lectura.
- El motor continúa calculando con la precisión interna de JavaScript.
- El redondeo de presentación no modifica el resultado interno.
