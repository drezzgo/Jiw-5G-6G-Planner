# Línea base de requisitos

## Requisito académico A — PENDIENTE DE TEXTO LITERAL

> **Pendiente:** copiar aquí el enunciado exacto del profesor.

### Interpretación operacional actualmente confirmada

El proyecto debe incluir modelado/simulación de comunicaciones 5G y 6G. Esta obligación no es opcional y debe satisfacerse junto con el requisito B.

### Decisión de alcance

- **5G:** se modelará como 5G NR mediante cálculos radioeléctricos y modelos/documentación aplicable.
- **6G:** se modelará como **IMT-2030 experimental**, sin afirmar que existe una interfaz radio comercial final equivalente a 5G NR.

### Estado

`OPEN — no cerrar Fase 0 sin copiar el texto literal.`

---

## Requisito académico B — TEXTO SUMINISTRADO

> “Proponga un sistema que recomiende o implemente las especificaciones técnicas, equipos requeridos para su prueba de implementación en Colombia, para asegurar la calidad y seguridad de la información.”

### Descomposición

**“Proponga un sistema”**
→ aplicación web académica.

**“que recomiende o implemente”**
→ motor de reglas transparente + propuesta técnica; la red física real no es requisito del MVP.

**“las especificaciones técnicas”**
→ perfil radio, arquitectura, bandas, parámetros y compatibilidad.

**“equipos requeridos”**
→ categorías y posteriormente candidatos concretos verificados.

**“para su prueba de implementación en Colombia”**
→ capa regulatoria + propuesta de laboratorio + plan de pruebas.

**“para asegurar la calidad”**
→ métricas, requisitos de servicio, medición y criterios de aceptación.

**“y seguridad de la información”**
→ controles de acceso, red, transporte/aplicación, administración y datos.

### Estado

`BASELINED`

---

# Requisitos derivados del producto

## RF-01

La aplicación debe calcular un enlace radio con unidades explícitas.

## RF-02

La aplicación debe mostrar las ecuaciones y resultados intermedios para sustentación.

## RF-03

La aplicación debe distinguir viabilidad radio de compatibilidad tecnológica.

## RF-04

La aplicación debe determinar `VIABLE`, `MARGINAL` o `NO VIABLE` únicamente con criterios documentados/configurables.

## ASSESS-01

Debe existir selector:

- 5G NR;
- IMT-2030 experimental;
- comparar.

## ASSESS-02

Cada criterio debe devolver:

- PASS;
- FAIL;
- CONDITIONAL;
- NOT_EVALUABLE.

## ASSESS-03

Un fallo debe indicar:

- qué condición falló;
- valor calculado/configurado;
- referencia o criterio;
- explicación;
- variables relacionadas.

## ASSESS-04

No se utilizará un “porcentaje global de cumplimiento” como criterio principal. Los criterios críticos pueden bloquear el escenario.

## REF-01

Los presets deben ser auditables y trazables.

## REF-02

Debe existir al menos:

- un caso de referencia 5G viable;
- un caso derivado degradado/no viable.

## GEO-01

El mapa no será fuente de la matemática RF: solo proveerá geografía/visualización.

## ADV-01

El Advisor debe recomendar arquitectura, equipos, calidad, seguridad, regulación y plan de pruebas.

## SRC-01

Toda recomendación o umbral debe poder clasificarse por procedencia.
