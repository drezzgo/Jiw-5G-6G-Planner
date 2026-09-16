# Refinamiento UX — Fase 3

## Problema detectado

La primera versión era técnicamente útil pero demasiado densa:

- demasiados parámetros visibles simultáneamente;
- fórmulas presentadas como código;
- exceso de explicaciones repetidas;
- inputs HTML `number` con comportamiento incómodo para decimales;
- demasiada información técnica antes de mostrar el resultado principal.

## Decisión

Se adopta **progressive disclosure**.

### Vista principal

Solo muestra:

- frecuencia;
- distancia;
- bandwidth;
- potencia TX;
- sensibilidad RX.

Los parámetros de antena, pérdidas, NF y temperatura quedan en:

`Parámetros avanzados`

### Resultados

La jerarquía visual prioriza:

1. potencia recibida;
2. SNR;
3. link margin;
4. capacidad teórica de Shannon.

FSPL, EIRP y ruido quedan como métricas secundarias.

### Fórmulas

Todas las fórmulas se agrupan en:

`Ver desarrollo del cálculo`

Se usa una tipografía matemática del sistema y notación legible con subíndices Unicode.

No se añade KaTeX/MathJax en esta fase para evitar una dependencia adicional únicamente estética.

### Modo sustentación

Cuando se activa:

- el desarrollo matemático se abre;
- los criterios del assessment se abren;
- se conserva la explicación técnica detallada.

Así la misma interfaz sirve para:

- usuario que solo quiere diseñar;
- estudiante que quiere entender;
- sustentación frente al profesor.

## Inputs

Los campos visibles usan `type="text"` con `inputMode="decimal"`.

Ventajas:

- no aparece validación de `step` con precisiones extrañas;
- acepta punto o coma decimal;
- el valor visual se redondea;
- internamente el Core sigue recibiendo números y unidades normalizadas.

No se cambia ninguna ecuación del Radio Engine.

## Render

La calculadora utiliza:

`client:only="react"`

Motivo:

- el dashboard es una aplicación interactiva completamente cliente;
- evita el fallo observado durante el prerender SSR;
- Astro sigue generando estáticamente el shell de la página.

La arquitectura matemática y de assessment permanece independiente de React.
