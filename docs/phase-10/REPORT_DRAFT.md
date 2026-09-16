# JIW 5G/6G Planner Colombia
## Borrador técnico consolidado del informe académico

**Asignatura:** Teoría de la Información  
**Programa:** Ingeniería Telemática  
**Tipo de proyecto:** herramienta web académica de simulación y planificación radioeléctrica

---

# 1. Título

**Sistema web de planificación radioeléctrica y recomendación técnica para escenarios 5G NR e IMT-2030 en Colombia**

---

# 2. Pregunta de investigación

**¿Cómo puede una herramienta web integrar simulación radioeléctrica y criterios técnicos, regulatorios, de calidad y seguridad para apoyar el diseño de pruebas de comunicaciones 5G y escenarios experimentales IMT-2030 en Colombia?**

---

# 3. Enunciados del proyecto

## Enunciado 1 — texto literal del docente

> “Diseñar he implementar modular y simular 5g y
6g parámetros de comunicación (potencia ganancia pérdidas distancias frecuencias
parámetros de calidad de señal ancho de banda velocidades latencies) y los estándares técnicos que los define que permiten una comunicación adecuada de la información”

### Interpretación técnica para el proyecto

Sin modificar el texto original, lo interpretamos como la necesidad de:

- diseñar una solución modular;
- modelar y simular escenarios 5G y 6G/IMT-2030;
- trabajar con potencia, ganancias, pérdidas, distancia y frecuencia;
- incorporar parámetros de calidad de señal;
- considerar ancho de banda, velocidad y latencia;
- relacionar los cálculos con los estándares técnicos que los sustentan;
- explicar qué condiciones permiten una comunicación adecuada de la información.

## Enunciado 2 — texto literal del docente

> “Proponga un sistema que recomiende o implemente, las especificaciones técnicas, equipos requeridos para su implementación en
Colombia Sistema de recomendación, lo principal que asegure la calidad y la seguridad de la información”

### Interpretación técnica para el proyecto

Lo interpretamos como la necesidad de:

- reunir especificaciones técnicas;
- identificar equipos y capacidades necesarias para una prueba;
- contextualizar la implementación en Colombia;
- incorporar criterios de calidad;
- incorporar criterios de seguridad de la información;
- presentar recomendaciones justificadas y trazables.

## Nota de redacción

En el informe conservamos ambos enunciados literalmente, incluyendo su redacción original. Las interpretaciones anteriores son únicamente una normalización técnica para organizar el proyecto y no sustituyen lo indicado por el docente.

---

# 4. Resumen

JIW 5G/6G Planner Colombia es una aplicación web académica que integra cálculo de presupuesto de enlace, evaluación técnica de un perfil 5G NR n78, modelos de propagación 3GPP, orientación de antena, cobertura, perfil de terreno, zona de Fresnel y un módulo experimental IMT-2030.

El proyecto no busca reemplazar una herramienta profesional de planificación RF. Su objetivo es permitir que los cálculos, supuestos y fuentes puedan revisarse de manera directa durante la sustentación y que cada resultado tenga una explicación técnica trazable.

---

# 5. Alcance

El alcance se definió a partir de los dos enunciados del docente. El primero se cubre principalmente con la Calculadora RF, el Planificador y el módulo IMT-2030. El segundo se cubre mediante la evaluación técnica, las fuentes, la documentación de equipos y criterios de calidad/seguridad incluidos en el proyecto y en el informe.

El proyecto implementa:

- presupuesto de enlace;
- pérdida en espacio libre;
- ruido térmico;
- SNR;
- margen respecto a sensibilidad;
- capacidad teórica de Shannon;
- evaluación técnica del perfil n78;
- mapa gNB/UE;
- distancia y rumbo;
- modelos UMi, UMa e InH de 3GPP TR 38.901;
- escenarios LOS y NLOS seleccionados por el usuario;
- patrón direccional simplificado de antena;
- mapa académico de cobertura;
- perfil de terreno;
- primera zona de Fresnel;
- módulo experimental IMT-2030.

El proyecto no implementa:

- una pila 5G completa;
- scheduler;
- HARQ completo;
- handover;
- emulación de 5GC;
- SDR;
- ray tracing;
- interferencia intercelda completa;
- Massive MIMO completo;
- certificación 3GPP;
- predicción profesional de cobertura.

---

# 6. Arquitectura

La aplicación se organiza en tres módulos visibles:

## 6.1 Calculadora RF

Permite estudiar el enlace de forma paramétrica.

Entradas principales:

- frecuencia;
- distancia;
- ancho de banda;
- potencia transmitida;
- sensibilidad del receptor.

Entradas avanzadas:

- ganancias;
- pérdidas;
- figura de ruido;
- temperatura.

Resultados:

- pérdida;
- PIRE;
- potencia recibida;
- ruido;
- SNR;
- margen;
- capacidad de Shannon.

## 6.2 Planificador geográfico

Utiliza coordenadas de gNB y UE para calcular:

- distancia;
- rumbo;
- propagación;
- ganancia efectiva;
- cobertura;
- relieve;
- despeje de Fresnel.

## 6.3 IMT-2030 experimental

Compara referencias publicadas para IMT-2030 únicamente con magnitudes que el modelo puede calcular.

El módulo evita afirmar cumplimiento final de 6G.

---

# 7. Fundamento matemático

## 7.1 Pérdida en espacio libre

La pérdida en espacio libre se calcula como:

`FSPL = 20 log10(4πdf/c)`

donde:

- `d` es la distancia;
- `f` es la frecuencia;
- `c` es la velocidad de la luz.

## 7.2 PIRE

`PIRE = Ptx + Gtx − Ltx`

## 7.3 Potencia recibida

`Prx = PIRE − PL + Grx − Lrx`

## 7.4 Ruido

El ruido se obtiene a partir de:

`kTB`

y se incorpora la figura de ruido del receptor.

## 7.5 SNR

`SNR = Prx − Pruido`

## 7.6 Margen

`Margen = Prx − Sensibilidad`

Un margen positivo significa que la potencia calculada queda por encima de la sensibilidad configurada.

## 7.7 Shannon

`C = B log2(1 + SNRlin)`

Se utiliza como límite teórico de capacidad.

No se presenta como throughput real.

---

# 8. Perfil 5G NR

El perfil académico principal utiliza:

- banda n78;
- 3,5 GHz como frecuencia de referencia;
- TDD;
- SCS de 30 kHz;
- ancho de banda de 100 MHz;
- arquitectura SA como decisión del proyecto.

La aplicación separa:

- compatibilidad técnica;
- resultado físico del enlace;
- contexto regulatorio;
- decisiones académicas del proyecto.

---

# 9. Propagación

Se implementaron cuatro alternativas:

- FSPL;
- UMi Street Canyon;
- UMa;
- InH Office.

FSPL se conserva como referencia ideal.

Los modelos UMi, UMa e InH utilizan expresiones de 3GPP TR 38.901 y verifican su dominio antes de calcular.

Si el escenario queda fuera del dominio del modelo, la aplicación no extrapola el resultado.

---

# 10. LOS y NLOS

LOS significa que existe un trayecto directo dominante.

NLOS significa que ese trayecto está bloqueado o fuertemente obstruido.

En esta versión LOS/NLOS continúa siendo una selección explícita del usuario.

El perfil de terreno se usa como evidencia adicional y no cambia automáticamente esa condición, porque un DEM no representa de forma completa edificios, vegetación u otros obstáculos.

---

# 11. Antena y cobertura

El proyecto permite comparar:

- ganancia fija;
- elemento direccional de referencia.

Para el patrón direccional se utiliza el patrón de un elemento de antena de 3GPP TR 38.901.

No se afirma que represente un arreglo Massive MIMO completo.

La cobertura evalúa múltiples puntos alrededor de la gNB y reutiliza:

- distancia;
- rumbo;
- ganancia;
- propagación;
- presupuesto de enlace;
- margen.

---

# 12. Terreno y Fresnel

El perfil altimétrico utiliza datos de Copernicus DEM GLO-90 consultados mediante Open-Meteo Elevation API.

El análisis permite revisar:

- línea geométrica respecto al terreno;
- primera zona de Fresnel;
- referencia de despeje del 60% de F1.

El modelo no representa edificios ni detalles urbanos finos.

---

# 13. IMT-2030

El módulo IMT-2030 se presenta como experimental.

La herramienta puede:

- calcular Shannon;
- calcular eficiencia espectral teórica;
- comparar límites matemáticos con referencias publicadas.

La herramienta no calcula:

- latencia real;
- movilidad;
- precisión de posicionamiento;
- tasa pico completa del sistema;
- cumplimiento final de una interfaz radio 6G.

Cuando una variable no puede obtenerse con el modelo actual, la interfaz la muestra como no evaluable.

---

# 14. Relación con Teoría de la Información

El proyecto relaciona directamente conceptos de la asignatura con un escenario de telecomunicaciones.

La ecuación de Shannon permite observar cómo:

- aumentar ancho de banda aumenta el límite de capacidad;
- aumentar SNR aumenta el límite de capacidad;
- reducir potencia recibida puede reducir SNR y por tanto capacidad;
- propagación, antena y distancia afectan indirectamente la capacidad al modificar la potencia recibida.

De esta forma, la aplicación conecta la teoría matemática del canal con variables físicas de un enlace inalámbrico.

---

# 15. Validación

La validación del proyecto se apoya en:

- pruebas unitarias del motor matemático;
- casos numéricos conocidos;
- verificación de dominios de propagación;
- pruebas de geometría;
- pruebas de patrón de antena;
- pruebas de cobertura;
- pruebas de Fresnel;
- pruebas del módulo IMT-2030;
- `pnpm build`;
- revisión manual de la interfaz.

---

# 16. Limitaciones

Los principales límites son:

- modelos simplificados;
- ausencia de interferencia intercelda completa;
- ausencia de edificios en el perfil de terreno;
- ausencia de MIMO completo;
- Shannon como límite teórico;
- resultados dependientes de parámetros académicos;
- ausencia de validación con hardware real.

Estas limitaciones se muestran porque son necesarias para interpretar correctamente los resultados.

---

# 17. Correspondencia con los enunciados

## Enunciado 1

| Requisito del enunciado | Implementación en JIW Planner |
|---|---|
| Diseño modular | Core matemático separado de UI, propagación, antenas, terreno e IMT-2030 |
| Simulación 5G | Calculadora RF + Planificador |
| Simulación 6G | Módulo IMT-2030 experimental |
| Potencia | Potencia TX, PIRE y potencia recibida |
| Ganancia | Ganancia TX/RX y patrón direccional |
| Pérdidas | FSPL, modelos 3GPP y pérdidas configurables |
| Distancia | Distancia geográfica gNB–UE |
| Frecuencia | Configuración y validación n78 |
| Calidad de señal | SNR, margen y potencia recibida |
| Ancho de banda | Variable de entrada y validación del perfil |
| Velocidad | Shannon como límite teórico, no throughput real |
| Latencia | Se reconoce como variable importante, pero no se inventa un valor cuando el modelo no la simula |
| Estándares | 3GPP/ETSI, ITU-R y fuentes regulatorias colombianas |

## Enunciado 2

| Requisito del enunciado | Implementación en JIW Planner |
|---|---|
| Especificaciones técnicas | Perfil n78, TDD, SCS, ancho de banda y arquitectura del proyecto |
| Equipos requeridos | Se documentan por función y capacidad técnica en el informe |
| Implementación en Colombia | Contexto MinTIC y banda de 3500 MHz documentados |
| Sistema de recomendación | La evaluación técnica indica qué criterios pasan, fallan o requieren revisión |
| Calidad | Potencia recibida, SNR, margen, propagación y cobertura |
| Seguridad | Referencias de arquitectura y seguridad 5G, más controles de laboratorio documentados |

La aplicación no necesita un módulo separado de “asesor” para cumplir esta trazabilidad. Mantener las recomendaciones dentro de la evaluación, la documentación y el informe evita duplicar información en la interfaz.

---

# 18. Conclusiones preliminares

1. Es posible integrar en una sola herramienta los cálculos principales de un enlace 5G con modelos de propagación y contexto geográfico.

2. La visualización permite relacionar variables de Teoría de la Información con parámetros físicos de telecomunicaciones.

3. La separación entre resultados calculados, parámetros del proyecto y fuentes técnicas evita presentar supuestos como si fueran requisitos universales.

4. El módulo IMT-2030 permite estudiar referencias de investigación sin afirmar que ya existe una especificación 6G final.

5. El proyecto conserva trazabilidad suficiente para que cada resultado pueda explicarse y verificarse durante la sustentación.

---

# 19. Pendientes antes del informe final

- seleccionar capturas finales de la web;
- registrar resultados definitivos de los escenarios demostrativos;
- revisar la bibliografía completa;
- adaptar la redacción al formato solicitado por el docente;
- comprobar la correspondencia entre cada requisito del curso y una sección del informe.
