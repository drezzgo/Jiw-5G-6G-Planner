# Decisiones de arquitectura — Fase 0

## ADR-001 — Astro como shell principal

**Decisión:** utilizar Astro como framework principal.

**Razón:** gran parte del proyecto es contenido académico, documentación, explicación, fuentes y resultados que no requieren hidratación cliente.

**React se reserva para:**
- calculadora;
- assessment dashboard;
- mapa;
- coverage viewer;
- interacciones complejas.

**Beneficio académico:** permite explicar claramente la separación:
- Astro = documento/aplicación;
- React = interacción;
- TypeScript Core = ingeniería.

---

## ADR-002 — React como una isla cohesionada para el simulador

No fragmentar el simulador en muchas islas que compartan estado continuamente.

La calculadora/planner puede ser una isla principal:

`RadioPlanner`

con componentes internos React.

---

## ADR-003 — TypeScript Core sin React

Las ecuaciones y reglas viven fuera de la UI.

Capas previstas:

- radio;
- propagation;
- antennas;
- geography;
- coverage;
- assessment;
- advisor;
- knowledge.

React nunca será la fuente de verdad matemática.

---

## ADR-004 — MapLibre en fase posterior

MapLibre se introduce después de validar la calculadora.

El mapa calcula/entrega:
- coordenadas;
- distancia;
- bearing;
- visualización.

No debe contener las ecuaciones RF.

---

## ADR-005 — Sin backend en el MVP inicial

Los cálculos base pueden ejecutarse en navegador.

Backend solo si aparece una necesidad concreta:
- proteger API key;
- proxy de datos;
- cálculo demasiado pesado;
- integración externa.

---

## ADR-006 — Web Worker para cobertura

No es necesario para un enlace único.

Se añadirá cuando exista grid de cobertura para evitar bloquear UI.

---

## ADR-007 — 5G e IMT-2030 no son perfiles equivalentes

**5G NR**
- tecnología estandarizada;
- se puede verificar contra especificaciones aplicables.

**IMT-2030**
- marco y requisitos en proceso de desarrollo/evaluación;
- se mostrará como evaluación experimental/prospectiva;
- no se mostrará “certificado/cumple 6G”.

---

## ADR-008 — No usar un score porcentual como cumplimiento principal

Un criterio crítico puede invalidar un escenario aunque muchos criterios informativos pasen.

Resultado agregado:

- `PASS`: todos los criterios críticos evaluables pasan;
- `PASS_WITH_WARNINGS`: críticos pasan, existen advertencias;
- `FAIL`: al menos un crítico falla;
- `NOT_EVALUABLE`: información insuficiente para una conclusión responsable.
