import type {
  GeoPoint,
} from '../geography';

export interface TerrainSample {
  point: GeoPoint;
  distanceM: number;
  elevationM: number;
}

export interface TerrainAnalyzedSample
  extends TerrainSample {
  lineOfSightHeightM: number;
  fresnelRadiusM: number;
  fresnel60LowerHeightM: number;

  terrainClearanceM: number;
  fresnel60ClearanceM: number;
}

export interface TerrainProfileAnalysis {
  samples: TerrainAnalyzedSample[];

  totalDistanceM: number;
  frequencyHz: number;

  txGroundElevationM: number;
  rxGroundElevationM: number;

  txAntennaAbsoluteHeightM: number;
  rxAntennaAbsoluteHeightM: number;

  geometricLosClear: boolean;
  fresnel60Clear: boolean;

  minimumTerrainClearanceM: number;
  minimumFresnel60ClearanceM: number;
  maximumFresnelRadiusM: number;

  criticalTerrainSample:
    TerrainAnalyzedSample;

  criticalFresnelSample:
    TerrainAnalyzedSample;
}
