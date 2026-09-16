# Criterio UX — Presentation First

## Contexto real de uso

JIW Planner es un proyecto académico.

La interfaz principal debe servir para una sustentación de aproximadamente:

`8–10 minutos`

ante profesor y clase.

Por tanto, la prioridad de UX no es imitar una aplicación empresarial con decenas
de pantallas. La prioridad es:

1. comprender;
2. demostrar;
3. verificar;
4. profundizar solo cuando se necesite.

## Regla de diseño

Cada pantalla debe tener dos capas.

### Capa de exposición

Visible inmediatamente:

- decisión;
- parámetros principales;
- resultado;
- gráfico/mapa;
- estado.

### Capa de profundidad

Bajo demanda:

- fórmulas;
- sustitución;
- fuentes;
- explicación extensa;
- evidencia normativa.

## Barra de sustentación

Se añade una navegación sticky común a:

- `/`;
- `/calculadora`;
- `/planner`.

Permite saltar entre herramientas sin volver a buscar menús.

Dentro de cada página aparecen accesos directos a sus secciones relevantes.

### Calculadora

- Escenario
- Cálculo
- Evaluación

### Planificador

- Modelo
- Antena
- Mapa
- Cobertura
- Terreno

## Modo exposición

El botón `Modo exposición`:

- permanece entre páginas mediante `localStorage`;
- reduce cabeceras y espacios;
- oculta texto auxiliar;
- mantiene resultados y controles;
- reduce altura del mapa;
- conserva todos los detalles disponibles fuera del modo.

La URL:

`/calculadora?present=1`

activa directamente este modo.

La página principal usa esa ruta para `Iniciar sustentación`.

## Qué NO hacer

No intentar meter literalmente todo el proyecto en una única pantalla.

Eso produciría:

- saturación visual;
- texto ilegible;
- pérdida de jerarquía;
- dificultad para explicar.

El objetivo es que cualquier elemento importante quede a:

- cero scroll;
- un botón de ancla;
- o un detalle desplegable.

Nunca debe ser necesario “buscar” una sección durante la sustentación.

## Ruta propuesta

### 0:00–1:00

Problema, objetivo y alcance.

### 1:00–3:00

Calculadora:

- parámetros;
- fórmula;
- sustitución;
- margen.

### 3:00–6:00

Planificador:

- mapa;
- propagación;
- antena;
- cobertura.

### 6:00–8:00

Terreno y Fresnel.

### 8:00–10:00

Evaluación, fuentes, limitaciones y recomendación final.

Esta ruta deberá actualizarse cuando se integren IMT-2030 y Advisor Colombia.
