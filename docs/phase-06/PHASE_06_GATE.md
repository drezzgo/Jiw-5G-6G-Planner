# Gate de Fase 6

## Automatizado

- [ ] tests anteriores siguen pasando.
- [ ] tests de antena pasan.
- [ ] tests de cobertura pasan.
- [ ] `pnpm build` pasa.

## Antena

- [ ] ganancia fija reproduce el comportamiento anterior.
- [ ] elemento 3GPP da 8 dBi en boresight.
- [ ] 65° de offset horizontal aplica 12 dB de atenuación.
- [ ] atenuación se limita a 30 dB.
- [ ] azimut cambia la ganancia hacia UE.
- [ ] downtilt cambia la ganancia hacia UE.
- [ ] popovers explican azimut, downtilt, haz y ganancia efectiva.

## Cobertura

- [ ] Worker genera cuadrícula.
- [ ] mapa no se bloquea durante el cálculo.
- [ ] capa verde/naranja/roja/gris aparece.
- [ ] orientación de antena cambia forma de cobertura.
- [ ] LOS/NLOS cambia cobertura.
- [ ] UMi/UMa/InH respetan dominio.
- [ ] cobertura puede ocultarse.
- [ ] resultados indican número de celdas evaluables.

## Rigor

- [ ] no se llama al elemento 3GPP “antena óptima”.
- [ ] no se presenta como Massive MIMO completo.
- [ ] 10 dB de margen verde es visualización del proyecto, no umbral 3GPP.
- [ ] cobertura se describe como académica.
- [ ] no se modifica potencia automáticamente.

## Rendimiento

- [ ] MapLibre se carga con import dinámico.
- [ ] cobertura se calcula en Web Worker.
- [ ] warning de chunk, si permanece, queda documentado y no se silencia artificialmente.
