import type { GeoPoint } from './types';

/**
 * Radio medio de la Tierra usado por este modelo esférico simplificado.
 *
 * Clasificación: ASSUMPTION / PROJECT_MODEL.
 *
 * No sustituye una solución geodésica elipsoidal de alta precisión.
 */
export const EARTH_MEAN_RADIUS_M = 6_371_008.8;

function assertFinite(value: number, label: string): void {
  if (!Number.isFinite(value)) {
    throw new Error(`${label} debe ser un número finito.`);
  }
}

export function assertGeoPoint(point: GeoPoint): void {
  assertFinite(point.lat, 'latitud');
  assertFinite(point.lng, 'longitud');

  if (point.lat < -90 || point.lat > 90) {
    throw new Error(
      'La latitud debe estar entre -90 y 90 grados.',
    );
  }

  if (point.lng < -180 || point.lng > 180) {
    throw new Error(
      'La longitud debe estar entre -180 y 180 grados.',
    );
  }
}

function toRadians(degrees: number): number {
  return degrees * Math.PI / 180;
}

function toDegrees(radians: number): number {
  return radians * 180 / Math.PI;
}

/**
 * Distancia de círculo máximo usando la fórmula de Haversine.
 *
 * Adecuada para la escala académica de esta fase.
 * No incorpora relieve ni altura de antenas.
 */
export function calculateGreatCircleDistanceM(
  from: GeoPoint,
  to: GeoPoint,
): number {
  assertGeoPoint(from);
  assertGeoPoint(to);

  const lat1 = toRadians(from.lat);
  const lat2 = toRadians(to.lat);
  const deltaLat = toRadians(to.lat - from.lat);
  const deltaLng = toRadians(to.lng - from.lng);

  const a =
    Math.sin(deltaLat / 2) ** 2
    + Math.cos(lat1)
      * Math.cos(lat2)
      * Math.sin(deltaLng / 2) ** 2;

  const centralAngle =
    2 * Math.atan2(
      Math.sqrt(a),
      Math.sqrt(1 - a),
    );

  return EARTH_MEAN_RADIUS_M * centralAngle;
}

/**
 * Rumbo inicial desde `from` hacia `to`, medido:
 *
 * 0°   = norte
 * 90°  = este
 * 180° = sur
 * 270° = oeste
 *
 * Devuelve null cuando ambos puntos coinciden porque
 * no existe una dirección definida.
 */
export function calculateInitialBearingDeg(
  from: GeoPoint,
  to: GeoPoint,
): number | null {
  assertGeoPoint(from);
  assertGeoPoint(to);

  if (
    from.lat === to.lat
    && from.lng === to.lng
  ) {
    return null;
  }

  const lat1 = toRadians(from.lat);
  const lat2 = toRadians(to.lat);
  const deltaLng = toRadians(to.lng - from.lng);

  const y =
    Math.sin(deltaLng) * Math.cos(lat2);

  const x =
    Math.cos(lat1) * Math.sin(lat2)
    - Math.sin(lat1)
      * Math.cos(lat2)
      * Math.cos(deltaLng);

  const bearing = toDegrees(Math.atan2(y, x));

  return (bearing + 360) % 360;
}

export function bearingToCardinal(
  bearingDeg: number | null,
): string {
  if (bearingDeg === null) {
    return 'Sin dirección';
  }

  const directions = [
    'N',
    'NE',
    'E',
    'SE',
    'S',
    'SO',
    'O',
    'NO',
  ] as const;

  const index =
    Math.round(bearingDeg / 45) % directions.length;

  return directions[index];
}
