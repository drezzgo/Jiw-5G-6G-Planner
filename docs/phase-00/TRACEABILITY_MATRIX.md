# Matriz de trazabilidad — Profesor → funcionalidad → evidencia

> Esta matriz es el principal artefacto de control de alcance.

| ID | Requisito | Función del sistema | Evidencia/entregable | Fase |
|---|---|---|---|---:|
| A-01 | Modelar/simular 5G | Radio Engine + 3GPP propagation | cálculo reproducible + tests | 2/5 |
| A-02 | Modelar/simular 6G | modo IMT-2030 experimental | comparación documentada | 8 |
| A-03 | Mostrar comportamiento de comunicación | Calculadora RF | PL, Prx, SNR, margin, Shannon | 3 |
| A-04 | Determinar si habría enlace | Viability Engine | viable/marginal/no viable | 2/3 |
| A-05 | Comparar escenarios | Assessment Dashboard | 5G / IMT-2030 / comparar | 3/8 |
| B-01 | Proponer un sistema | Web Astro | aplicación desplegable | 3+ |
| B-02 | Recomendar especificaciones | Advisor | ficha de especificaciones | 9 |
| B-03 | Recomendar equipos | Equipment Advisor | categorías + candidatos verificados | 9 |
| B-04 | Prueba en Colombia | Regulatory/Test Advisor | advertencias + plan piloto | 9 |
| B-05 | Calidad | Quality Advisor | métricas + pruebas + aceptación | 9 |
| B-06 | Seguridad de información | Security Advisor | controles y justificación | 9 |
| B-07 | Justificación | Knowledge Base | fuente por regla/recomendación | 1/9 |
| S-01 | Sustentación | Calculadora paso a paso | ecuaciones + “por qué” | 3 |
| S-02 | Diagnóstico | Blocker Panel | lista de criterios fallidos | 3 |
| S-03 | Procedencia | Provenance Tags | estándar/regulación/fabricante/etc. | 1/3 |

## Regla

Si una funcionalidad futura no puede apuntar a una fila de esta matriz, debe justificarse antes de implementarse.

## Pendiente

Actualizar las filas `A-*` cuando se reciba el texto literal del enunciado A.
