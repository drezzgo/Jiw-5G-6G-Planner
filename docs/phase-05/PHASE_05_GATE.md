# Gate de Fase 5

## Tests

- [ ] tests previos continúan pasando.
- [ ] UMi LOS test pasa.
- [ ] UMi NLOS test pasa.
- [ ] UMa LOS test pasa.
- [ ] InH NLOS test pasa.
- [ ] UMi > 5 km no extrapola.
- [ ] InH > 150 m 3D no extrapola.
- [ ] `pnpm build` pasa.

## UI

- [ ] selector FSPL funciona.
- [ ] selector UMi funciona.
- [ ] selector UMa funciona.
- [ ] selector InH funciona.
- [ ] selector LOS/NLOS funciona.
- [ ] se muestra diferencia contra FSPL.
- [ ] se muestran alturas del perfil.
- [ ] se muestra ubicación documental de 3GPP.
- [ ] fuera de rango aparece advertencia y no un número extrapolado.

## Arquitectura

- [ ] las fórmulas 3GPP viven en `core/propagation`.
- [ ] React no contiene las fórmulas.
- [ ] Radio Engine acepta pérdida externa.
- [ ] cálculo FSPL original sigue funcionando.

## Comprensión

- [ ] mover el mapa NO cambia potencia TX.
- [ ] mover el mapa NO cambia ganancia TX.
- [ ] mover el mapa NO cambia sensibilidad.
- [ ] la aplicación no dice que elige automáticamente una antena óptima.
- [ ] LOS/NLOS no se infiere de edificios en esta fase.
