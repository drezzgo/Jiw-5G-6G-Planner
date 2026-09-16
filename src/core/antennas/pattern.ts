import type {
  AntennaConfig,
  AntennaGainResult,
  AntennaGeometry,
} from './types';

export const THREE_GPP_ELEMENT_MAX_GAIN_DBI = 8;
export const THREE_GPP_ELEMENT_HPBW_DEG = 65;
export const THREE_GPP_ELEMENT_VPBW_DEG = 65;
export const THREE_GPP_ELEMENT_MAX_ATTENUATION_DB = 30;
export const THREE_GPP_ELEMENT_VERTICAL_SIDELobe_ATTENUATION_DB = 30;

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

/**
 * JavaScript distingue +0 y -0 con Object.is().
 * Matemáticamente son equivalentes, pero normalizamos
 * la salida para evitar propagar -0 a tests, UI o JSON.
 */
function normalizeZero(
  value: number,
): number {
  return Object.is(value, -0)
    ? 0
    : value;
}

export function normalizeSignedAngleDeg(
  angleDeg: number,
): number {
  assertFinite(angleDeg, 'angleDeg');

  let value =
    ((angleDeg + 180) % 360 + 360) % 360 - 180;

  if (Object.is(value, -0)) {
    value = 0;
  }

  return value;
}

/**
 * Patrón de potencia de un elemento de antena
 * según 3GPP TR 38.901, tabla 7.3-1.
 *
 * Los offsets se expresan respecto al boresight:
 * - horizontalOffsetDeg = 0° en la dirección principal;
 * - verticalOffsetDeg = 0° en la dirección principal.
 */
export function calculate3gppElementPatternGain(
  horizontalOffsetDeg: number,
  verticalOffsetDeg: number,
): {
  gainDbi: number;
  attenuationDb: number;
  horizontalAttenuationDb: number;
  verticalAttenuationDb: number;
} {
  assertFinite(
    horizontalOffsetDeg,
    'horizontalOffsetDeg',
  );

  assertFinite(
    verticalOffsetDeg,
    'verticalOffsetDeg',
  );

  const horizontalAttenuationDb =
    normalizeZero(
      -Math.min(
        12
          * (
            horizontalOffsetDeg
            / THREE_GPP_ELEMENT_HPBW_DEG
          ) ** 2,
        THREE_GPP_ELEMENT_MAX_ATTENUATION_DB,
      ),
    );

  const verticalAttenuationDb =
    normalizeZero(
      -Math.min(
        12
          * (
            verticalOffsetDeg
            / THREE_GPP_ELEMENT_VPBW_DEG
          ) ** 2,
        THREE_GPP_ELEMENT_VERTICAL_SIDELobe_ATTENUATION_DB,
      ),
    );

  const attenuationDb =
    normalizeZero(
      -Math.min(
        -(
          horizontalAttenuationDb
          + verticalAttenuationDb
        ),
        THREE_GPP_ELEMENT_MAX_ATTENUATION_DB,
      ),
    );

  return {
    gainDbi:
      THREE_GPP_ELEMENT_MAX_GAIN_DBI
      + attenuationDb,
    attenuationDb,
    horizontalAttenuationDb,
    verticalAttenuationDb,
  };
}

export function calculateEffectiveTxGain(
  config: AntennaConfig,
  geometry: AntennaGeometry,
): AntennaGainResult {
  assertFinite(
    config.fixedGainDbi,
    'fixedGainDbi',
  );

  assertFinite(
    config.azimuthDeg,
    'azimuthDeg',
  );

  assertFinite(
    config.downtiltDeg,
    'downtiltDeg',
  );

  assertFinite(
    geometry.bearingDeg,
    'bearingDeg',
  );

  if (
    !Number.isFinite(geometry.distance2DM)
    || geometry.distance2DM <= 0
  ) {
    throw new Error(
      'distance2DM debe ser mayor que cero.',
    );
  }

  const horizontalOffsetDeg =
    normalizeSignedAngleDeg(
      geometry.bearingDeg
      - config.azimuthDeg,
    );

  const depressionAngleDeg =
    Math.atan2(
      geometry.bsHeightM
      - geometry.utHeightM,
      geometry.distance2DM,
    )
    * 180
    / Math.PI;

  const verticalOffsetDeg =
    depressionAngleDeg
    - config.downtiltDeg;

  if (config.mode === 'FIXED_GAIN') {
    return {
      mode: config.mode,
      effectiveGainDbi:
        config.fixedGainDbi,
      peakGainDbi:
        config.fixedGainDbi,
      attenuationDb: 0,
      horizontalOffsetDeg,
      verticalOffsetDeg,
      depressionAngleDeg,
      sourceType: 'PROJECT_PARAMETER',
      sourceId: 'SCENARIO_FIXED_GAIN',
    };
  }

  const pattern =
    calculate3gppElementPatternGain(
      horizontalOffsetDeg,
      verticalOffsetDeg,
    );

  return {
    mode: config.mode,
    effectiveGainDbi:
      pattern.gainDbi,
    peakGainDbi:
      THREE_GPP_ELEMENT_MAX_GAIN_DBI,
    attenuationDb:
      pattern.attenuationDb,
    horizontalOffsetDeg,
    verticalOffsetDeg,
    depressionAngleDeg,
    sourceType: 'STANDARD',
    sourceId:
      '3GPP_TR_38_901_R19_4_0',
    sourceLocator:
      'Cláusula 7.3 · Tabla 7.3-1 · página PDF 29',
  };
}
