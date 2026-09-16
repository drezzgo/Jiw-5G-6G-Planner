# Fase 11D — Navegación y rendimiento con Astro

## Problema

El cambio entre Calculadora, Planner e IMT-2030 hacía una navegación completa del
navegador. Además, los tres módulos interactivos usan React con `client:only`, por
lo que podía existir un intervalo visible mientras cargaba el island.

## Cambios

### ClientRouter

Todas las páginas principales incluyen `ClientRouter` mediante
`NavigationEnhancer.astro`.

Esto permite navegación del lado cliente entre:

- `/`;
- `/calculadora`;
- `/planner`;
- `/imt2030`.

### Prefetch

Los cuatro enlaces de la barra principal usan:

```html
data-astro-prefetch="load"
```

Como el proyecto tiene únicamente cuatro rutas principales, calentamos sus
HTML después de la carga inicial para reducir la espera al cambiar de módulo.

Astro también habilita prefetch automáticamente cuando se usa `ClientRouter`.

### View Transitions

El contenido principal usa una transición `fade` de 140 ms.

No aplicamos una animación larga: la transición solo debe evitar el corte visual,
no hacer que la aplicación se sienta lenta.

### Lifecycle

El script de Modo exposición fue adaptado a:

- `astro:page-load`;
- `astro:after-swap`.

Esto es necesario porque el body se reemplaza durante la navegación del
ClientRouter.

### Fallback de islands

Calculadora, Planner e IMT-2030 conservan `client:only="react"` porque esa fue la
estrategia estable del proyecto para estos módulos.

Ahora muestran un fallback HTML mientras React termina de cargar.

### Indicador de navegación

La franja superior muestra una pequeña animación mientras Astro prepara la nueva
ruta usando:

- `astro:before-preparation`;
- `astro:after-preparation`;
- `astro:page-load`.

## Decisiones que NO tomamos

No activamos características experimentales de prerender del cliente.

Para este proyecto, ClientRouter + prefetch + islands con fallback ofrecen una
mejora clara sin aumentar el riesgo antes de la sustentación.
