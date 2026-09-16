import type {
  AntennaConfig,
} from '../antennas';

import type {
  GeoPoint,
} from '../geography';

import type {
  LinkBudgetInput,
} from '../radio/contracts';

import type {
  PropagationCondition,
  PropagationModelId,
} from '../propagation';

export interface CoverageInput {
  center: GeoPoint;

  radiusM: number;
  gridSize: number;

  radio: LinkBudgetInput;

  propagationModel:
    PropagationModelId;

  propagationCondition:
    PropagationCondition;

  antenna: AntennaConfig;
}

export type CoverageCellStatus =
  | 'PASS'
  | 'FAIL'
  | 'NOT_EVALUABLE';

export interface CoverageCell {
  id: string;

  center: GeoPoint;
  polygon: GeoPoint[];

  distanceM: number;
  bearingDeg: number;

  antennaGainDbi?: number;
  pathLossDb?: number;
  receivedPowerDbm?: number;
  snrDb?: number;
  linkMarginDb?: number;

  status: CoverageCellStatus;
  note?: string;
}

export interface CoverageResult {
  cells: CoverageCell[];

  totalCells: number;
  evaluableCells: number;
  passingCells: number;
  failingCells: number;
  notEvaluableCells: number;

  radiusM: number;
  gridSize: number;
}
