# Corrección del Worker de MapLibre en Vite

## Síntoma

Durante `pnpm dev`, Vite mostró:

```text
The file does not exist at ".../node_modules/.vite/deps/maplibre-gl-worker.mjs"
The dependency might be incompatible with the dep optimizer.
```

## Causa

MapLibre GL JS v6 distribuye su runtime como módulos ES e incluye un Web Worker
separado.

Para Vite, la documentación oficial de MapLibre recomienda importar el Worker con:

```ts
import workerUrl from
  'maplibre-gl/dist/maplibre-gl-worker.mjs?worker&url';
```

y registrarlo una vez mediante:

```ts
setWorkerUrl(workerUrl);
```

`?worker&url` obliga a que el archivo pase por el pipeline de workers de Vite y
genere un chunk autocontenido.

No usamos simplemente `?url`, porque el worker de MapLibre importa internamente su
módulo compartido y el recurso podría quedar incompleto en producción.

## Relación con el warning de chunks

Este cambio resuelve el warning del **worker faltante en desarrollo**.

No necesariamente elimina el warning independiente:

```text
Some chunks are larger than 500 kB after minification
```

Ese warning corresponde al tamaño del bundle y se analiza por separado.
