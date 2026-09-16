# Ajuste de voz y navegación — Fase 7C

## Objetivo

La interfaz debe sonar como un proyecto construido y explicado por estudiantes,
no como una tercera persona describiendo lo que los estudiantes deberían hacer.

## Voz de redacción

Preferimos formulaciones como:

- `En este proyecto usamos...`
- `Construimos la herramienta para...`
- `Comparamos...`
- `Nuestro alcance es...`
- `La usamos para...`

Evitamos formulaciones como:

- `La web está organizada para que la exposición...`
- `El profesor podrá...`
- `La aplicación guía al estudiante...`
- `Una demostración de 8–10 minutos...`

La aplicación debe explicar el proyecto, no comentar desde afuera cómo será
presentado.

## Inicio

Se elimina el bloque de tiempos de sustentación.

El bloque pasa a llamarse:

`Cómo usamos la herramienta`

y describe el flujo técnico:

1. configuramos;
2. ubicamos;
3. modelamos;
4. comprobamos;
5. contrastamos.

## Diagrama principal

Como los bloques del diagrama están dispuestos verticalmente, las flechas deben
mostrar continuidad vertical:

`↓`

y no:

`→`

## Modo exposición

Sigue existiendo como opción manual porque puede ser útil para compactar la
interfaz.

Reglas:

- nunca se activa desde una URL;
- la página abre en disposición normal;
- solo se activa al pulsar `Modo exposición`;
- se conserva únicamente dentro de la pestaña actual mediante `sessionStorage`;
- puede desactivarse en cualquier momento.

La página principal ya no tiene un botón que active el modo automáticamente.

## Navegación

Se conservan accesos rápidos por sección, pero sin numerarlos como diapositivas:

Calculadora:

- Escenario
- Cálculo
- Evaluación

Planificador:

- Modelo
- Antena
- Mapa
- Cobertura
- Terreno

Esto mantiene la navegación rápida sin convertir la interfaz en una presentación.
