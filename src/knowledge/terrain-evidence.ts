export const terrainEvidence = {
  copernicus: {
    authority:
      'Copernicus / European Space Agency',
    document:
      'Copernicus DEM GLO-90',
    locator:
      'Producto global con resolución de 90 m',
    supports:
      'Fuente del modelo digital de elevación utilizado para el perfil del terreno.',
    url:
      'https://documentation.dataspace.copernicus.eu/Data/Others/CCM.html',
  },

  elevationApi: {
    authority:
      'Open-Meteo',
    document:
      'Elevation API',
    locator:
      'Endpoint /v1/elevation',
    supports:
      'Acceso web a elevaciones basadas en Copernicus DEM 2021 GLO-90. Permite hasta 100 coordenadas por solicitud.',
    url:
      'https://open-meteo.com/en/docs/elevation-api',
  },

  fresnel: {
    authority:
      'ITU-R',
    document:
      'Recommendation ITU-R P.526-16 — Propagation by diffraction',
    locator:
      'Annex 1 · §2.1 · ecuación (2)',
    supports:
      'Definición del radio de los elipsoides y zonas de Fresnel.',
    url:
      'https://www.itu.int/rec/R-REC-P.526-16-202511-I/en',
  },

  clearance: {
    authority:
      'ITU-R',
    document:
      'Recommendation ITU-R P.530-19',
    locator:
      'Annex 1 · §2.2.2 · Planning criteria for path clearance',
    supports:
      'Referencia de despeje de al menos 60% del radio de la primera zona de Fresnel para aproximar condiciones de espacio libre en enlaces LoS.',
    url:
      'https://www.itu.int/rec/R-REC-P.530-19-202509-I/en',
  },
} as const;
