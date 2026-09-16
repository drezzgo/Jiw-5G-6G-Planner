# Fase 7D — Interpretaciones naturales y estabilidad visual

## 1. Criterio de redacción

Cuando mostramos un resultado no basta con escribir:

`Pasa`

o:

`El perfil utiliza TDD`.

La interfaz debe responder, en lenguaje sencillo:

1. qué observamos;
2. qué significa;
3. por qué el criterio pasa o falla;
4. qué podemos concluir;
5. qué NO podemos concluir.

Ejemplo:

Antes:

`El perfil n78 evaluado utiliza TDD.`

Ahora:

`El escenario está configurado con TDD. Esto quiere decir que transmisión y
recepción utilizan la misma banda de frecuencia, pero se separan en distintos
instantes de tiempo...`

## 2. Regulación colombiana

No debemos escribir simplemente:

`Cumple MinTIC`

porque un único parámetro no demuestra cumplimiento regulatorio integral.

La redacción usa expresiones como:

`Este criterio coincide con la condición TDD que MinTIC establece para los
asignatarios a los que aplica la regulación consultada.`

y aclara:

`Esto no significa que todo el despliegue cumpla la regulación ni que exista
autorización para usar el espectro.`

## 3. Terreno

La interpretación se desglosa para personas que no conocen Fresnel.

Se explica:

- qué significa que el terreno no cruce la línea geométrica;
- qué significa que sí la cruce;
- por qué LOS geométrica no garantiza LOS real;
- por qué Fresnel puede estar comprometida incluso con línea directa;
- qué representa el criterio de 60% de F1.

## 4. Estabilidad UI

Se corrigen diferencias entre modo normal y modo exposición.

Principio:

**compactar no debe significar desmontar partes internas del layout.**

Por ello el modo exposición deja de ocultar elementos que mantenían alturas o
alineaciones de las rejillas.

Se normalizan especialmente:

- chips de Perfil / Frecuencia / Ancho;
- controles de propagación y antena;
- unidades de inputs;
- tarjetas de métricas;
- bloques de interpretación.

## 5. Resultado esperado

La vista normal y la vista de exposición deben conservar:

- los mismos centros;
- las mismas columnas;
- los mismos tamaños relativos;
- la misma jerarquía.

El modo exposición únicamente reduce espacio y contenido secundario.
