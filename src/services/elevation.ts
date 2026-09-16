import type {
  GeoPoint,
} from '../core/geography';

interface OpenMeteoElevationResponse {
  elevation?: number[];
  error?: boolean;
  reason?: string;
}

const ELEVATION_ENDPOINT =
  'https://api.open-meteo.com/v1/elevation';

export async function fetchCopernicusElevations(
  points: GeoPoint[],
): Promise<number[]> {
  if (
    points.length < 1
    || points.length > 100
  ) {
    throw new Error(
      'El servicio permite entre 1 y 100 coordenadas por solicitud.',
    );
  }

  const url =
    new URL(
      ELEVATION_ENDPOINT,
    );

  url.searchParams.set(
    'latitude',
    points
      .map(
        (point) =>
          point.lat.toFixed(7),
      )
      .join(','),
  );

  url.searchParams.set(
    'longitude',
    points
      .map(
        (point) =>
          point.lng.toFixed(7),
      )
      .join(','),
  );

  const response =
    await fetch(
      url.toString(),
      {
        headers: {
          Accept:
            'application/json',
        },
      },
    );

  const payload =
    await response
      .json() as
        OpenMeteoElevationResponse;

  if (
    !response.ok
    || payload.error
  ) {
    throw new Error(
      payload.reason
      ?? `El servicio de elevación respondió ${response.status}.`,
    );
  }

  if (
    !Array.isArray(
      payload.elevation,
    )
    || payload.elevation.length
      !== points.length
    || payload.elevation.some(
      (value) =>
        !Number.isFinite(value),
    )
  ) {
    throw new Error(
      'El perfil de elevación recibido está incompleto.',
    );
  }

  return payload.elevation;
}
