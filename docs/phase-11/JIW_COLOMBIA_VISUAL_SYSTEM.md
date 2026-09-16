# JIW Colombia — Sistema visual

## Objetivo

Tomamos la referencia de Caldera como guía de composición, no como una copia.

Conservamos sus principios más útiles para JIW:

- lienzo cálido;
- superficies planas;
- jerarquía por color y espacio;
- navegación tipo pill;
- pocos colores cromáticos;
- ausencia de sombras innecesarias.

La identidad se adapta a un proyecto académico colombiano.

---

# Paleta

## Base

| Token | Color | Uso |
|---|---|---|
| Canvas | `#E9E7DF` | fondo general |
| Surface | `#F8F7F2` | tarjetas |
| Surface raised | `#FFFFFF` | inputs y tarjetas de lectura |
| Ink | `#111820` | texto |
| Muted | `#626973` | texto secundario |

## Colombia / JIW

| Token | Color | Uso |
|---|---|---|
| Azul JIW | `#003893` | navegación, acciones, enlaces, gNB |
| Amarillo JIW | `#FCD116` | badges, foco, destacados |
| Rojo JIW | `#CE1126` | UE, error y acento limitado |

Los tres colores no tienen el mismo peso.

El azul es el color de interacción principal.

El amarillo funciona como highlight.

El rojo se reserva para estados de fallo, UE y pequeños detalles.

Esto evita convertir la interfaz en una bandera literal.

---

# Superficies

La jerarquía visual se basa en:

```text
canvas cálido
    ↓
tarjeta marfil
    ↓
contenido blanco
    ↓
azul / amarillo para énfasis
```

Las sombras se eliminan casi por completo.

---

# Navegación

La barra superior se convierte en una superficie tipo pill.

- fondo marfil;
- activo azul;
- pequeño punto amarillo;
- modo exposición amarillo;
- divisores punteados.

---

# Inicio

El hero mantiene el contenido académico, pero añade:

- fondo cálido;
- halos muy suaves amarillo/azul/rojo;
- patrón de puntos azul;
- botones pill;
- tarjeta destacada amarilla.

No usamos fotografías ni recursos decorativos ajenos al proyecto.

---

# Mapas

La cartografía no se recolorea porque debe conservar legibilidad.

Solo cambiamos la semántica de marcadores:

- gNB = azul;
- UE = rojo.

Los colores de cobertura siguen siendo semánticos:

- verde;
- naranja;
- rojo.

No deben reemplazarse por los colores de marca porque representan calidad del enlace.

---

# Accesibilidad

El amarillo nunca se utiliza como texto principal sobre blanco.

Se usa amarillo con texto oscuro.

El azul usa texto blanco cuando funciona como fondo de acción.

El rojo se mantiene principalmente para fallos y señalización.
