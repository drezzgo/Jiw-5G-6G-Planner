# Política de lenguaje y ayudas contextuales — Fase 3

## Objetivo

La aplicación está orientada a Colombia y debe ser comprensible para:

- estudiantes que apenas empiezan cursos de telecomunicaciones;
- usuarios técnicos;
- personas con conocimientos generales de redes;
- docentes durante la sustentación.

## Regla de lenguaje

Se prioriza español claro.

Se mantienen siglas o términos ingleses únicamente cuando:

1. son el identificador habitual de una tecnología o estándar;
2. traducirlos puede dificultar relacionarlos con la documentación técnica;
3. se acompañan de una explicación clara en español.

Ejemplos:

- `5G NR` → se conserva;
- `IMT-2030` → se conserva;
- `TDD` → se conserva, pero se explica como duplexación por división en el tiempo;
- `SA` → se conserva, pero se explica como arquitectura 5G Standalone;
- `SCS` → se conserva, pero se explica como separación entre subportadoras;
- `SNR` → se conserva junto a “relación señal/ruido”;
- `FSPL` → se conserva junto a “pérdida en espacio libre”;
- `EIRP` → la interfaz prioriza `PIRE`, manteniendo `EIRP` entre paréntesis.

Se eliminan de la interfaz expresiones no necesarias como:

- baseline;
- screening;
- assessment dashboard;
- bandwidth;
- noise figure;
- link margin.

Sus equivalentes visibles pasan a ser:

- referencia ideal;
- evaluación exploratoria;
- panel de evaluación;
- ancho de banda;
- figura de ruido;
- margen de enlace.

## Ayudas contextuales

Cada parámetro incluye un icono `?`.

La ayuda debe explicar:

1. qué representa;
2. qué ocurre cuando aumenta;
3. qué ocurre cuando disminuye;
4. en qué ecuaciones o reglas se utiliza.

## Accesibilidad

La ayuda no depende exclusivamente del hover.

También se abre mediante:

- foco de teclado;
- navegación con `Tab`;
- interacción táctil al enfocar el botón.

La información esencial no queda únicamente dentro del popover: nombre, unidad y valor permanecen visibles permanentemente.

## Principio pedagógico

La interfaz debe permitir tres niveles de lectura:

1. **rápido:** valor y resultado;
2. **guiado:** ayuda contextual por parámetro;
3. **profundo:** desarrollo matemático y criterios del modo sustentación.
