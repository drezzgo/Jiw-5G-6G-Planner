# Fase 8B — Textos concisos, términos técnicos y fórmulas

## 1. Lenguaje de la interfaz

La regla pasa a ser:

**explicar solo lo necesario para entender el resultado.**

Un texto visible debe responder como máximo:

- qué significa;
- por qué importa.

El detalle adicional queda en:

- popovers;
- fuentes;
- secciones desplegables.

Ejemplo:

Antes:

`Nuestro modelo calcula un único enlace teórico y no representa toda la interfaz
radio, agregación, MIMO, planificación de recursos...`

Ahora:

`No la evaluamos: el modelo no incluye MIMO ni el sistema radio completo.`

## 2. Términos técnicos

Se crea un componente compartido:

`TechnicalTerm`

La apariencia es:

- semibold;
- línea inferior punteada;
- cursor de ayuda;
- popover al hover, foco o clic.

El popover debe ser corto: una definición, no una clase teórica.

Se aplica inicialmente a términos frecuentes como:

- n78;
- SCS;
- TDD;
- SA;
- SNR;
- FSPL;
- PIRE / EIRP;
- Shannon;
- MIMO;
- WP 5D;
- IMT-2030;
- RIT;
- LOS / NLOS;
- DEM;
- Fresnel;
- gNB;
- UE.

Este componente será el patrón para las fases siguientes.

## 3. Fórmulas

Los cálculos de IMT-2030 dejan de usar una apariencia tipo bloque de código oscuro.

La fórmula ahora usa:

- tipografía de la propia interfaz;
- variables destacadas;
- subíndices y superíndices reales;
- fondo claro;
- sustitución separada del resultado.

Esto mantiene el mismo lenguaje visual de Calculadora y Planner.
