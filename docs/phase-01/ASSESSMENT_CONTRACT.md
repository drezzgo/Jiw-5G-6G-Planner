# Contrato del Assessment Engine

## Objetivo

Traducir resultados matemáticos y configuración tecnológica en una evaluación explicable.

La evaluación no modifica el escenario ni “arregla” automáticamente valores.

---

# Modos del selector

## 5G NR

Puede aplicar reglas con fuentes 3GPP, fabricante y criterios del proyecto.

Etiqueta de UI recomendada:

**Evaluación frente a perfil 5G NR**

## IMT-2030

Etiqueta de UI:

**Alineación con perfil IMT-2030 experimental**

No usar:

- “certificación 6G”;
- “cumple norma 6G final”;
- “6G NR”.

## Comparar

Ejecuta ambos perfiles sobre el mismo escenario y muestra diferencias.

---

# Estados

`PASS`

El criterio tiene suficiente información y se satisface.

`FAIL`

El criterio tiene suficiente información y no se satisface.

`CONDITIONAL`

La conclusión depende de una condición adicional o configuración.

`NOT_EVALUABLE`

No existe información suficiente o todavía no corresponde afirmar cumplimiento.

---

# Severidad

`CRITICAL`

Su fallo bloquea el resultado agregado.

`WARNING`

No bloquea necesariamente, pero debe destacarse.

`INFO`

Resultado informativo.

---

# Procedencia

Cada regla debe indicar:

- `STANDARD`
- `REGULATION`
- `MANUFACTURER`
- `PROJECT_REQUIREMENT`
- `EXPERIMENTAL_PARAMETER`

Los valores calculados serán `CALCULATION`.

---

# Resultado agregado

No utilizar porcentaje global como criterio principal.

Regla propuesta:

1. Un `CRITICAL + FAIL` produce `FAIL`.
2. Todos los críticos pasan y existen warnings → `PASS_WITH_WARNINGS`.
3. Todos los críticos evaluables pasan → `PASS`.
4. Faltan datos críticos → `NOT_EVALUABLE`.

---

# Bloqueadores

Cada fallo debe devolver:

- criterio;
- valor observado;
- valor/rango requerido;
- unidad;
- explicación;
- sourceId;
- variables que influyen;
- posible acción de corrección, sin modificar el escenario automáticamente.

---

# Separación conceptual

## Compatibilidad tecnológica

Ejemplos futuros:

- banda;
- frecuencia;
- duplex mode;
- bandwidth permitido;
- SA/NSA;
- capacidades UE/gNB.

## Viabilidad radio

- Prx;
- SNR;
- margin.

## Desempeño

- Shannon;
- throughput medido;
- latencia;
- jitter;
- packet loss.

Un escenario puede ser tecnológicamente compatible y radioeléctricamente inviable, o viceversa.
