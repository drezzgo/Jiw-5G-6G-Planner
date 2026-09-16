# Fase 5 — Modelos de propagación 3GPP TR 38.901

## Pregunta que resuelve esta fase

Hasta Fase 4, mover el UE solo alteraba la distancia y la pérdida se calculaba como
espacio libre ideal.

Fase 5 añade la pregunta:

**¿En qué tipo de entorno ocurre el enlace?**

## Lo que NO hace

No existe una “antena óptima 3GPP” que la aplicación deba seleccionar automáticamente.

3GPP documenta:

- modelos;
- bandas;
- parámetros;
- escenarios;
- requisitos técnicos.

La elección de antena/equipo depende del diseño y de especificaciones de producto.

Por eso:

```text
distancia cambia
        ↓
modelo de propagación cambia la pérdida
        ↓
resultado RF cambia

PERO

potencia / antena / sensibilidad
no cambian silenciosamente
```

En una fase posterior el recomendador podrá indicar qué modificación conviene y por qué.

---

# Fuente principal

**3GPP TR 38.901 v19.4.0 / ETSI TR 138 901 V19.4.0 (2026-07)**

Título:

`Study on channel model for frequencies from 0.5 to 100 GHz`

Se utiliza:

- cláusula 7.4.1;
- tabla 7.4.1-1;
- páginas PDF 36–38;
- tabla 7.2-2 para alturas Indoor Office.

---

# Modelos

## FSPL

Permanece como referencia ideal.

No es un modelo urbano.

## UMi — Street Canyon

Perfil usado:

- hBS = 10 m;
- hUT = 1,5 m;
- hE = 1 m;
- 10 m ≤ d2D ≤ 5 km.

Permite:

- LOS;
- NLOS.

## UMa

Perfil usado:

- hBS = 25 m;
- hUT = 1,5 m;
- hE = 1 m.

Con hUT = 1,5 m, la regla de altura efectiva de entorno descrita en la nota 1
lleva al caso hE = 1 m.

Dominio usado:

- 10 m ≤ d2D ≤ 5 km.

## InH — Office

Perfil:

- hBS = 3 m;
- hUT = 1 m.

Estos valores provienen de los parámetros de escenario Indoor-Office de la tabla
7.2-2.

Dominio:

- 1 m ≤ d3D ≤ 150 m.

---

# LOS y NLOS

En esta fase LOS/NLOS es seleccionado por el usuario.

La línea dibujada sobre el mapa NO detecta:

- edificios;
- paredes;
- relieve;
- obstrucciones.

Por tanto no podemos deducir LOS automáticamente solo a partir de dos coordenadas.

---

# Política de extrapolación

Si un escenario está fuera del dominio documentado:

- no se calcula una pérdida 3GPP;
- no se extiende la fórmula;
- se muestra `Fuera del dominio del modelo`.

Esto es preferible académicamente a producir un número aparentemente preciso fuera
del rango de aplicabilidad de la fuente.

---

# Integración con Radio Engine

Se añade:

`calculateLinkBudgetFromPathLoss(input, pathLossDb)`

Por tanto:

```text
FSPL ----------------┐
                     │
UMi -----------------┤
                     ├─> mismo Radio Engine
UMa -----------------┤
                     │
InH -----------------┘
```

No se duplican:

- EIRP;
- Prx;
- ruido;
- SNR;
- margen;
- Shannon.
