# Evidencia técnica — Fase 7

Verificación: 2026-09-16.

## Copernicus DEM

Fuente oficial:

Copernicus Data Space Ecosystem.

El producto GLO-90 ofrece cobertura global con resolución de 90 m.

Referencia:

https://documentation.dataspace.copernicus.eu/Data/Others/CCM.html

## Open-Meteo Elevation API

Documentación:

https://open-meteo.com/en/docs/elevation-api

La API:

- acepta coordenadas WGS84;
- permite una o múltiples coordenadas;
- admite hasta 100 coordenadas por solicitud;
- declara utilizar Copernicus DEM 2021 GLO-90 con resolución de 90 m.

## ITU-R P.526-16

Título:

`Propagation by diffraction`

Estado:

vigente.

Ubicación usada:

- Annex 1;
- §2.1;
- ecuación (2).

Define el radio del elipsoide/zona de Fresnel:

`Rn = sqrt(n λ d1 d2 / (d1 + d2))`

## ITU-R P.530-19

Título:

`Propagation data and prediction methods required for the design of terrestrial line-of-sight systems`

Estado:

vigente.

Ubicación usada:

- Annex 1;
- §2.2.2.

La recomendación indica que, a frecuencias por encima de aproximadamente 2 GHz,
la teoría de difracción relaciona condiciones cercanas al espacio libre con un
despeje de al menos 60% del radio de la primera zona de Fresnel.

## Alcance

La aplicación utiliza este 60% como:

`REFERENCE / PLANNING INDICATOR`

No como:

`universal 5G acceptance threshold`.
