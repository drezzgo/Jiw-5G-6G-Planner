# Fase 3D — Ayudas visuales y evidencia indexada

## 1. Problema de los popovers

Los popovers anteriores estaban posicionados dentro de contenedores de la calculadora.
Eso podía provocar:

- desbordamiento horizontal;
- contenido cortado por el panel;
- pérdida de legibilidad cerca de los bordes de pantalla.

## Solución

Los popovers ahora se renderizan mediante un `portal` en `document.body`.

La posición:

1. parte de la ubicación real del botón `?`;
2. se limita al ancho visible de la ventana;
3. cambia automáticamente arriba/abajo según el espacio;
4. añade scroll interno si el contenido es alto;
5. en móvil se presenta como tarjeta inferior.

La ayuda sigue funcionando con:

- hover;
- foco de teclado;
- clic/toque.

---

## 2. Ayudas con ilustraciones conceptuales

Se incorporan diagramas SVG simples, sin imágenes externas, para conceptos donde una representación visual aporta más que texto.

Ejemplos:

- antena isotrópica frente a antena direccional;
- ancho de banda estrecho frente a amplio;
- distancia corta frente a larga;
- sensibilidad del receptor;
- alternancia temporal TDD;
- separación entre subportadoras.

Estas ilustraciones son pedagógicas y no están a escala.

### Antena isotrópica

La interfaz explica expresamente que:

- no es una antena física;
- es una referencia matemática ideal;
- `dBi` expresa ganancia respecto a esa referencia.

---

## 3. Evidencia técnica indexada

Un enlace al PDF completo no es suficiente para un usuario que está aprendiendo.

Las reglas principales ahora pueden mostrar:

- autoridad;
- documento;
- versión/fecha;
- cláusula, artículo, tabla y página;
- extracto breve;
- qué respalda;
- alcance y limitación;
- enlace oficial.

### 3GPP / ETSI

#### Banda n78

Documento:

`ETSI TS 138 101-1 V18.7.0 / 3GPP TS 38.101-1 Release 18`

Ubicación:

`Cláusula 5.2 · Tabla 5.2-1 · página PDF 35`

La tabla identifica n78 como 3300–3800 MHz y TDD.

#### Ancho de banda con SCS 30 kHz

Ubicación:

`Cláusula 5.3.5 · Tabla 5.3.5-1 · página PDF 62`

Se usa para el conjunto de anchos de banda evaluado por el perfil n78 / 30 kHz.

---

## 4. Contexto regulatorio de Colombia

En la interfaz debe hablarse de:

**normativa o regulación técnica colombiana**

y no de “ley técnica” de forma genérica.

Se indexa la compilación jurídica oficial de la:

`Resolución MinTIC 3947 de 2023`

como contexto regulatorio relacionado con la banda de 3500 MHz.

### Artículo 1

Identifica 3300–3620 MHz como la banda de 3500 MHz dentro del proceso regulado por la resolución.

### Artículo 26, literal a)

Establece condiciones técnicas para los asignatarios de permisos de la banda y señala TDD.

### Artículo 28

Establece condiciones de sincronización para determinadas redes TDD.

## Advertencia de alcance

Estas referencias NO significan:

- que 3300–3620 MHz sea espectro libre;
- que una universidad pueda transmitir sin autorización;
- que pasar las reglas de la aplicación implique cumplimiento regulatorio integral;
- que la Resolución 3947 sea aplicable de igual forma a todo experimento.

La aplicación mostrará estas fuentes como **contexto regulatorio trazable**.
La evaluación jurídica/regulatoria integral corresponde al Advisor Colombia de una fase posterior.
