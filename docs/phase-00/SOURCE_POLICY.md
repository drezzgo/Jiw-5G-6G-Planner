# Política de fuentes y procedencia

## Clasificación obligatoria

Toda afirmación técnica importante debe tener uno de estos tipos:

### STANDARD
Norma/especificación técnica.

Ejemplos:
- 3GPP;
- ITU-R.

### REGULATION
Norma o acto colombiano.

Ejemplos:
- MinTIC;
- ANE;
- CRC.

### MANUFACTURER
Especificación del fabricante.

### PROJECT_REQUIREMENT
Requisito seleccionado para nuestro piloto.

### EXPERIMENTAL_PARAMETER
Valor usado para experimentar.

### CALCULATION
Resultado derivado matemáticamente.

### RECOMMENDATION
Decisión del Advisor basada en reglas.

### ASSUMPTION
Simplificación declarada del modelo.

## Jerarquía

1. Fuente oficial primaria.
2. Estándar/organismo competente.
3. Fabricante oficial.
4. Documentación académica/primaria.
5. Fuente secundaria solo si no existe alternativa primaria adecuada.

## Reglas

- No convertir un `EXPERIMENTAL_PARAMETER` en `STANDARD`.
- No afirmar homologación sin verificación oficial.
- No afirmar “cumplimiento 3GPP completo” a partir de un link budget.
- No llamar “normativa 6G final” a requisitos IMT-2030 todavía en proceso.
- Guardar fecha de verificación para contenido regulatorio y equipos.

## Fuentes marco confirmadas en Fase 0

### ITU-R M.2160-0
Marco y objetivos generales de IMT-2030.
Estado: recomendación vigente.

### ITU-R WP 5D — IMT-2030
En 2026 se completaron borradores de requisitos técnicos mínimos y guías de evaluación; el proceso formal de IMT-2030 continúa.

### 3GPP
Fuente primaria futura para:
- arquitectura 5G;
- radio NR;
- canal/propagación;
- seguridad.

### Colombia
Fuentes prioritarias futuras:
- MinTIC;
- ANE;
- CRC.

## Regla para UI

Cada criterio mostrado en el Assessment Dashboard deberá incluir:

- `sourceType`;
- `sourceId`;
- explicación;
- fecha de verificación cuando aplique.
