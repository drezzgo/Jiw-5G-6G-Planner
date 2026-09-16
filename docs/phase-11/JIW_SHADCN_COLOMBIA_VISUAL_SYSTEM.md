# Fase 11E — Sistema visual monocromático con identidad Colombia

## Referencia

La nueva referencia se toma de un sistema estilo shadcn/ui:

- canvas gris claro;
- tarjetas blancas;
- texto casi negro;
- grises para jerarquía secundaria;
- tarjetas de 24 px;
- controles de 18 px;
- elevación muy sutil;
- botones primarios oscuros;
- inputs grises;
- sin gradientes ni superficies cromáticas grandes.

## Adaptación a JIW Colombia

No convertimos toda la interfaz en amarillo, azul y rojo.

La identidad Colombia aparece únicamente en:

- marca de tres puntos en la barra superior;
- pequeña marca tricolor del hero;
- gNB azul;
- UE rojo;
- enlaces técnicos en azul;
- detalles de identificación muy pequeños.

El resto de la aplicación es monocromático.

## Por qué

Esto permite:

1. mantener apariencia técnica y académica;
2. reducir ruido visual;
3. diferenciar estados semánticos de colores de marca;
4. evitar que la aplicación parezca una bandera;
5. conservar una alusión clara a Colombia.

## Reglas

### Base

```text
canvas     #f5f5f5
paper      #ffffff
surface    #fafafa
ink        #0a0a0a
ink soft   #171717
muted      #737373
hairline   #e5e5e5
```

### Colombia

```text
amarillo   #FCD116
azul       #003893
rojo       #CE1126
```

Los tres colores se usan como acento, nunca como fondo dominante de módulos.

### Radios

```text
cards      24px
controls   18px
nested     10px
```

### Acciones

- primaria: negro;
- secundaria: gris;
- terciaria: borde hairline;
- enlaces técnicos: azul Colombia.

### Elevación

Solo tarjetas importantes utilizan la sombra sutil del sistema.

No se usan:

- gradientes decorativos;
- halos de color;
- sombras cromáticas;
- grandes bloques amarillos, azules o rojos.
