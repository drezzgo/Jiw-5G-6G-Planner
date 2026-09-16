# Patch 11E — UI monocromática + Colombia

Aplicar SOBRE 11D.

Este patch reemplaza la dirección visual de 11C por una interpretación mucho más
cercana a la nueva referencia:

- monocromática;
- compacta;
- tarjetas blancas;
- fondo gris claro;
- bordes hairline;
- sombra sutil;
- controles de 18 px;
- tarjetas de 24 px;
- acciones principales negras.

La identidad Colombia se conserva únicamente como acento.

## Aplicar

```powershell
Expand-Archive `
  -Path "S:\Downloads\jiw-planner-phase11e-shadcn-colombia-ui-overlay.zip" `
  -DestinationPath "." `
  -Force
```

## Validar

```powershell
pnpm exec vitest run
pnpm build
pnpm dev
```

## Revisar

```text
/
 /calculadora
 /planner
 /imt2030
```

### Inicio

- sin gradientes;
- hero blanco;
- botones negros/grises;
- marca tricolor pequeña;
- tarjetas blancas con sombra mínima.

### Calculadora

- inputs gris claro;
- acción principal negra;
- resultados en tarjetas neutras;
- sin chips amarillos grandes.

### Planner

- cards blancas;
- controles monocromáticos;
- gNB azul y UE rojo;
- colores de cobertura permanecen semánticos.

### IMT-2030

- tarjetas neutras;
- fórmula sobre gris suave;
- marca Colombia pequeña;
- azul solo en enlaces y referencias puntuales.

### Navegación

Se mantienen ClientRouter, prefetch y View Transitions de 11D.
