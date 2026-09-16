export type AntennaMode =
  | 'FIXED_GAIN'
  | 'THREE_GPP_SINGLE_ELEMENT';

export interface AntennaConfig {
  mode: AntennaMode;

  /**
   * Solo se usa en FIXED_GAIN.
   * Representa la ganancia efectiva constante definida
   * por el escenario académico.
   */
  fixedGainDbi: number;

  /**
   * Dirección horizontal del lóbulo principal:
   * 0° norte, 90° este, 180° sur, 270° oeste.
   */
  azimuthDeg: number;

  /**
   * Inclinación hacia abajo respecto al horizonte.
   */
  downtiltDeg: number;
}

export interface AntennaGeometry {
  bearingDeg: number;
  distance2DM: number;
  bsHeightM: number;
  utHeightM: number;
}

export interface AntennaGainResult {
  mode: AntennaMode;

  effectiveGainDbi: number;
  peakGainDbi: number;
  attenuationDb: number;

  horizontalOffsetDeg: number;
  verticalOffsetDeg: number;
  depressionAngleDeg: number;

  sourceType:
    | 'PROJECT_PARAMETER'
    | 'STANDARD';

  sourceId:
    | 'SCENARIO_FIXED_GAIN'
    | '3GPP_TR_38_901_R19_4_0';

  sourceLocator?: string;
}
