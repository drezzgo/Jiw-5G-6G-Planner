# Gate de Fase 4

## Automatizado

- [ ] `pnpm exec vitest run` pasa.
- [ ] tests de geodesia pasan.
- [ ] `pnpm build` pasa.

## Mapa

- [ ] `/planner` carga correctamente.
- [ ] se ve el mapa base.
- [ ] atribución OpenStreetMap visible.
- [ ] gNB visible.
- [ ] UE visible.
- [ ] ambos marcadores se pueden arrastrar.
- [ ] `Ubicar gNB` permite colocar el punto con clic.
- [ ] `Ubicar UE` permite colocar el punto con clic.
- [ ] línea entre gNB y UE se actualiza.
- [ ] `Centrar enlace` funciona.
- [ ] `Restablecer ejemplo` funciona.

## Geografía

- [ ] distancia cambia al mover puntos.
- [ ] rumbo cambia al mover puntos.
- [ ] coordenadas se muestran.
- [ ] puntos coincidentes no producen NaN.

## Radio

- [ ] distancia geográfica alimenta `distanceM`.
- [ ] FSPL cambia al mover puntos.
- [ ] Prx cambia al mover puntos.
- [ ] SNR cambia al mover puntos.
- [ ] margen cambia al mover puntos.
- [ ] no se duplicaron ecuaciones dentro del componente del mapa.

## Alcance

- [ ] no se afirma que la línea dibujada sea LOS real.
- [ ] no se usa todavía terreno.
- [ ] no se usa todavía patrón de antena.
- [ ] no se usa ubicación real del usuario.
- [ ] no se confunde posición con autorización de espectro.
