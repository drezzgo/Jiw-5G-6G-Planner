# FASE 0 — Definición definitiva del proyecto

## Nombre provisional

**JIW 5G/6G Planner Colombia**

## Título académico provisional

**Sistema web de planificación radioeléctrica y recomendación técnica para escenarios 5G NR e IMT-2030 en Colombia.**

## Problema

El proyecto debe satisfacer simultáneamente dos exigencias académicas:

1. modelar/simular comunicaciones asociadas con 5G y 6G;
2. proponer un sistema que recomiende o implemente especificaciones técnicas, equipamiento y condiciones para una prueba de implementación en Colombia, asegurando calidad y seguridad de la información.

El sistema no se planteará como una red móvil completa. Se plantea como una herramienta web académica que integra:

- cálculo y análisis radioeléctrico;
- comparación tecnológica;
- evaluación de viabilidad;
- recomendación técnica;
- trazabilidad con estándares y regulación.

## Objetivo general

Diseñar e implementar una herramienta web académica que permita configurar y analizar escenarios de enlace y cobertura 5G NR y escenarios experimentales IMT-2030, y que utilice dichos resultados junto con estándares y regulación para generar recomendaciones de arquitectura, especificaciones, equipos, calidad, seguridad y plan de prueba aplicable a Colombia.

## Preguntas que debe responder la aplicación

### Pregunta 1 — Radio

> ¿Bajo el modelo y parámetros configurados existe un enlace radio técnicamente viable?

### Pregunta 2 — Tecnología

> ¿La configuración seleccionada es compatible con el perfil 5G NR evaluado o se alinea con un perfil experimental IMT-2030?

### Pregunta 3 — Diagnóstico

> Si el escenario no satisface el perfil, ¿qué condiciones son las que lo impiden?

### Pregunta 4 — Implementación

> ¿Qué arquitectura, especificaciones, categorías de equipos, controles de calidad, seguridad y consideraciones regulatorias serían necesarias para plantear una prueba en Colombia?

## Módulos obligatorios del MVP

1. **Calculadora RF**
   - distancia;
   - pérdida de propagación;
   - EIRP;
   - potencia recibida;
   - ruido;
   - SNR;
   - margen de enlace;
   - capacidad teórica de Shannon.

2. **Assessment Dashboard**
   - selector `5G NR`;
   - selector `IMT-2030 experimental`;
   - modo `Comparar`;
   - estados `PASS`, `FAIL`, `CONDITIONAL`, `NOT_EVALUABLE`;
   - identificación de bloqueadores;
   - explicación y procedencia de cada criterio.

3. **Casos de referencia**
   - escenario 5G NR viable;
   - mismo escenario degradado/no viable;
   - valores trazables;
   - ningún preset construido solo para “forzar” un resultado verde o rojo.

4. **Planner geográfico**
   - Tx/gNB;
   - Rx/UE;
   - distancia;
   - orientación;
   - mapa interactivo.

5. **Propagación 5G**
   - FSPL como baseline ideal;
   - modelos seleccionados de 3GPP TR 38.901 para 5G cuando corresponda.

6. **Cobertura**
   - grid limitado;
   - clasificación de cobertura;
   - heatmap;
   - cálculo fuera del hilo principal cuando sea necesario.

7. **IMT-2030**
   - únicamente modo experimental/prospectivo;
   - no afirmar existencia de una interfaz radio 6G final;
   - comparar parámetros y objetivos documentados cuando sean aplicables.

8. **Advisor Colombia**
   - arquitectura;
   - bandas/compatibilidad;
   - equipos;
   - calidad;
   - seguridad;
   - espectro;
   - homologación cuando aplique;
   - plan de pruebas.

9. **Reporte**
   - resumen del escenario;
   - resultados;
   - evaluación;
   - bloqueadores;
   - recomendaciones;
   - fuentes y limitaciones.

## Funciones opcionales, condicionadas a utilidad académica

- elevación/DEM;
- perfil del terreno;
- LOS/NLOS derivado de terreno;
- zona de Fresnel;
- patrones más detallados de antena;
- catálogo ampliado de equipos.

Estas funciones NO se implementarán por defecto. Solo se añaden si mejoran una pregunta del proyecto y no desvían el alcance.

## Fuera de alcance

- PHY NR completo;
- OFDM muestra a muestra;
- scheduler real;
- HARQ completo;
- handover;
- RRC/PDCP completos;
- 5G Core real;
- SDR;
- ray tracing 3D;
- simulación electromagnética;
- Massive MIMO elemento por elemento;
- beam management completo;
- red comercial real;
- “6G NR” inventado;
- cumplimiento/certificación integral 3GPP;
- homologación automática;
- permisos automáticos de espectro;
- machine learning;
- inteligencia artificial como motor de decisión;
- backend complejo;
- base de datos como requisito inicial.

## Regla de alcance

Una funcionalidad entra al proyecto solo si responde afirmativamente a las tres preguntas:

1. ¿Es propia o directamente relevante para 5G NR o IMT-2030?
2. ¿Ayuda a satisfacer uno de los enunciados del profesor?
3. ¿Podemos implementarla y defenderla sin fingir una precisión mayor a la disponible?

Si alguna respuesta es **NO**, la funcionalidad queda fuera del MVP.
