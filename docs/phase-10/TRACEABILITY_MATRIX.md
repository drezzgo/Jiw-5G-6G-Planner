# Matriz de trazabilidad del proyecto

## Estado

La aplicación queda funcionalmente cerrada en la Fase 8.

La Fase 9 del asesor se elimina porque duplicaba información ya visible en los módulos existentes.

---

# Enunciados literales

## Enunciado 1

> “Diseñar he implementar modular y simular 5g y
6g parámetros de comunicación (potencia ganancia pérdidas distancias frecuencias
parámetros de calidad de señal ancho de banda velocidades latencies) y los estándares técnicos que los define que permiten una comunicación adecuada de la información”

## Enunciado 2

> “Proponga un sistema que recomiende o implemente, las especificaciones técnicas, equipos requeridos para su implementación en
Colombia Sistema de recomendación, lo principal que asegure la calidad y la seguridad de la información”

---

# Trazabilidad — Enunciado 1

| Necesidad | Evidencia en la aplicación | Estado |
|---|---|---|
| Diseño modular | Core separado por radio, propagación, antenas, cobertura, terreno e IMT-2030 | Implementado |
| Simular 5G | `/calculadora` y `/planner` | Implementado |
| Simular 6G | `/imt2030` en modo experimental | Implementado |
| Potencia | Ptx, PIRE y Prx | Implementado |
| Ganancias | Gtx, Grx y ganancia efectiva | Implementado |
| Pérdidas | Pérdidas TX/RX, FSPL y 3GPP | Implementado |
| Distancia | Distancia geodésica entre gNB y UE | Implementado |
| Frecuencia | Entrada RF + evaluación n78 | Implementado |
| Calidad de señal | SNR, margen y potencia recibida | Implementado |
| Ancho de banda | Entrada + evaluación técnica | Implementado |
| Velocidades | Shannon como límite teórico | Implementado con alcance explícito |
| Latencia | Reconocida como métrica, no simulada por el modelo actual | Limitación explícita |
| Estándares técnicos | 3GPP/ETSI e ITU-R | Implementado |
| Comunicación adecuada de la información | Evaluación de viabilidad del enlace y criterios técnicos | Implementado dentro del alcance académico |

# Trazabilidad — Enunciado 2

| Necesidad | Evidencia en la aplicación / informe | Estado |
|---|---|---|
| Especificaciones técnicas | n78, TDD, SCS, ancho de banda y arquitectura | Implementado |
| Equipos requeridos | Documentación técnica por función y capacidades necesarias | Documentado |
| Implementación en Colombia | Fuentes MinTIC y contexto de 3500 MHz | Implementado |
| Sistema de recomendación | Criterios PASS/FAIL/REVIEW y explicaciones | Implementado sin módulo separado |
| Calidad | SNR, margen, cobertura, propagación y terreno | Implementado |
| Seguridad de la información | Referencias 5G y controles de laboratorio documentados | Documentado |

## Decisión de alcance

No se conserva una página adicional de “Asesor Colombia”.

Las recomendaciones se distribuyen entre:

- Calculadora;
- Planificador;
- evaluaciones técnicas;
- fuentes;
- documentación;
- informe final.

Esto evita duplicación y mantiene la interfaz adecuada para una sustentación corta.
