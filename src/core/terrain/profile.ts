import {
  EARTH_MEAN_RADIUS_M,
  type GeoPoint,
} from '../geography';

import type {
  TerrainAnalyzedSample,
  TerrainProfileAnalysis,
  TerrainSample,
} from './types';

const C_M_PER_S =
  299_792_458;

function assertFinite(
  value: number,
  label: string,
): void {
  if (!Number.isFinite(value)) {
    throw new Error(
      `${label} debe ser un número finito.`,
    );
  }
}

function toRadians(
  degrees: number,
): number {
  return degrees * Math.PI / 180;
}

function toDegrees(
  radians: number,
): number {
  return radians * 180 / Math.PI;
}

function geoToUnitVector(
  point: GeoPoint,
): [number, number, number] {
  const lat =
    toRadians(point.lat);

  const lng =
    toRadians(point.lng);

  const cosLat =
    Math.cos(lat);

  return [
    cosLat * Math.cos(lng),
    cosLat * Math.sin(lng),
    Math.sin(lat),
  ];
}

function unitVectorToGeo(
  vector: [number, number, number],
): GeoPoint {
  const [x, y, z] =
    vector;

  const norm =
    Math.sqrt(
      x * x
      + y * y
      + z * z,
    );

  const nx = x / norm;
  const ny = y / norm;
  const nz = z / norm;

  return {
    lat:
      toDegrees(
        Math.atan2(
          nz,
          Math.sqrt(
            nx * nx
            + ny * ny,
          ),
        ),
      ),
    lng:
      toDegrees(
        Math.atan2(
          ny,
          nx,
        ),
      ),
  };
}

/**
 * Interpolación sobre círculo máximo mediante SLERP.
 *
 * Devuelve exactamente `from` cuando fraction = 0 y
 * exactamente `to` cuando fraction = 1.
 */
export function interpolateGreatCirclePoint(
  from: GeoPoint,
  to: GeoPoint,
  fraction: number,
): GeoPoint {
  if (
    !Number.isFinite(fraction)
    || fraction < 0
    || fraction > 1
  ) {
    throw new Error(
      'fraction debe estar entre 0 y 1.',
    );
  }

  if (fraction === 0) {
    return {...from};
  }

  if (fraction === 1) {
    return {...to};
  }

  const a =
    geoToUnitVector(from);

  const b =
    geoToUnitVector(to);

  const dot =
    Math.max(
      -1,
      Math.min(
        1,
        a[0] * b[0]
        + a[1] * b[1]
        + a[2] * b[2],
      ),
    );

  const omega =
    Math.acos(dot);

  if (
    Math.abs(omega) < 1e-12
  ) {
    return {
      lat:
        from.lat
        + (
          to.lat - from.lat
        ) * fraction,
      lng:
        from.lng
        + (
          to.lng - from.lng
        ) * fraction,
    };
  }

  const sinOmega =
    Math.sin(omega);

  const weightA =
    Math.sin(
      (1 - fraction)
      * omega,
    ) / sinOmega;

  const weightB =
    Math.sin(
      fraction
      * omega,
    ) / sinOmega;

  return unitVectorToGeo([
    a[0] * weightA
      + b[0] * weightB,
    a[1] * weightA
      + b[1] * weightB,
    a[2] * weightA
      + b[2] * weightB,
  ]);
}

export function recommendedTerrainSampleCount(
  distanceM: number,
): number {
  assertFinite(
    distanceM,
    'distanceM',
  );

  if (distanceM <= 0) {
    return 21;
  }

  /**
   * GLO-90 tiene resolución nominal de 90 m.
   * No ganamos precisión física solicitando cientos de
   * muestras por debajo de esa escala.
   */
  const desired =
    Math.ceil(
      distanceM / 90,
    ) + 1;

  return Math.max(
    21,
    Math.min(
      100,
      desired,
    ),
  );
}

export function generateTerrainSamplePoints(
  from: GeoPoint,
  to: GeoPoint,
  totalDistanceM: number,
  count:
    number = recommendedTerrainSampleCount(
      totalDistanceM,
    ),
): Array<{
  point: GeoPoint;
  distanceM: number;
}> {
  if (
    !Number.isInteger(count)
    || count < 2
    || count > 100
  ) {
    throw new Error(
      'count debe estar entre 2 y 100.',
    );
  }

  return Array.from(
    {
      length: count,
    },
    (_, index) => {
      const fraction =
        index
        / (count - 1);

      return {
        point:
          interpolateGreatCirclePoint(
            from,
            to,
            fraction,
          ),
        distanceM:
          totalDistanceM
          * fraction,
      };
    },
  );
}

/**
 * Radio de la primera zona de Fresnel.
 *
 * ITU-R P.526-16, §2.1, ecuación (2):
 *
 * R1 = sqrt(lambda * d1 * d2 / (d1 + d2))
 *
 * Las unidades internas son SI.
 */
export function calculateFirstFresnelRadiusM(
  frequencyHz: number,
  d1M: number,
  d2M: number,
): number {
  if (
    !Number.isFinite(frequencyHz)
    || frequencyHz <= 0
  ) {
    throw new Error(
      'frequencyHz debe ser mayor que cero.',
    );
  }

  if (
    !Number.isFinite(d1M)
    || !Number.isFinite(d2M)
    || d1M < 0
    || d2M < 0
  ) {
    throw new Error(
      'd1M y d2M deben ser no negativos.',
    );
  }

  const total =
    d1M + d2M;

  if (total === 0) {
    return 0;
  }

  const wavelengthM =
    C_M_PER_S
    / frequencyHz;

  return Math.sqrt(
    wavelengthM
    * d1M
    * d2M
    / total,
  );
}

export function analyzeTerrainProfile(
  samples: TerrainSample[],
  frequencyHz: number,
  txAntennaHeightM: number,
  rxAntennaHeightM: number,
): TerrainProfileAnalysis {
  if (samples.length < 2) {
    throw new Error(
      'Se requieren al menos dos muestras de terreno.',
    );
  }

  if (
    !Number.isFinite(
      txAntennaHeightM,
    )
    || txAntennaHeightM <= 0
    || !Number.isFinite(
      rxAntennaHeightM,
    )
    || rxAntennaHeightM <= 0
  ) {
    throw new Error(
      'Las alturas de antena deben ser mayores que cero.',
    );
  }

  const first =
    samples[0];

  const last =
    samples[
      samples.length - 1
    ];

  const totalDistanceM =
    last.distanceM;

  if (
    !Number.isFinite(
      totalDistanceM,
    )
    || totalDistanceM <= 0
  ) {
    throw new Error(
      'La distancia total debe ser mayor que cero.',
    );
  }

  const txAbsoluteM =
    first.elevationM
    + txAntennaHeightM;

  const rxAbsoluteM =
    last.elevationM
    + rxAntennaHeightM;

  const analyzed:
    TerrainAnalyzedSample[] =
      samples.map(
        (sample) => {
          const fraction =
            sample.distanceM
            / totalDistanceM;

          const lineHeightM =
            txAbsoluteM
            + (
              rxAbsoluteM
              - txAbsoluteM
            )
            * fraction;

          const d1M =
            sample.distanceM;

          const d2M =
            totalDistanceM
            - sample.distanceM;

          const fresnelRadiusM =
            calculateFirstFresnelRadiusM(
              frequencyHz,
              d1M,
              d2M,
            );

          const fresnel60LowerHeightM =
            lineHeightM
            - 0.6
              * fresnelRadiusM;

          return {
            ...sample,
            lineOfSightHeightM:
              lineHeightM,
            fresnelRadiusM,
            fresnel60LowerHeightM,
            terrainClearanceM:
              lineHeightM
              - sample.elevationM,
            fresnel60ClearanceM:
              fresnel60LowerHeightM
              - sample.elevationM,
          };
        },
      );

  const criticalTerrainSample =
    analyzed.reduce(
      (lowest, current) =>
        current.terrainClearanceM
          < lowest.terrainClearanceM
          ? current
          : lowest,
    );

  const criticalFresnelSample =
    analyzed.reduce(
      (lowest, current) =>
        current.fresnel60ClearanceM
          < lowest.fresnel60ClearanceM
          ? current
          : lowest,
    );

  const maximumFresnelRadiusM =
    Math.max(
      ...analyzed.map(
        (sample) =>
          sample.fresnelRadiusM,
      ),
    );

  return {
    samples: analyzed,
    totalDistanceM,
    frequencyHz,

    txGroundElevationM:
      first.elevationM,
    rxGroundElevationM:
      last.elevationM,

    txAntennaAbsoluteHeightM:
      txAbsoluteM,
    rxAntennaAbsoluteHeightM:
      rxAbsoluteM,

    geometricLosClear:
      criticalTerrainSample
        .terrainClearanceM >= 0,

    fresnel60Clear:
      criticalFresnelSample
        .fresnel60ClearanceM >= 0,

    minimumTerrainClearanceM:
      criticalTerrainSample
        .terrainClearanceM,

    minimumFresnel60ClearanceM:
      criticalFresnelSample
        .fresnel60ClearanceM,

    maximumFresnelRadiusM,

    criticalTerrainSample,
    criticalFresnelSample,
  };
}

/**
 * Utilidad informativa para estimar cuánto representa
 * una resolución angular de 90 m sobre la Tierra.
 */
export function nominalDemAngularResolutionDeg(): number {
  return 90
    / EARTH_MEAN_RADIUS_M
    * 180
    / Math.PI;
}
