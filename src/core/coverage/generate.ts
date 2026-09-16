import {
  calculateEffectiveTxGain,
} from '../antennas';

import {
  EARTH_MEAN_RADIUS_M,
  type GeoPoint,
} from '../geography';

import {
  calculate3gppPathLoss,
} from '../propagation';

import {
  calculateFsplDb,
  calculateLinkBudgetFromPathLoss,
} from '../radio';

import type {
  CoverageCell,
  CoverageInput,
  CoverageResult,
} from './types';

function assertCoverageInput(
  input: CoverageInput,
): void {
  if (
    !Number.isFinite(input.radiusM)
    || input.radiusM <= 0
  ) {
    throw new Error(
      'radiusM debe ser mayor que cero.',
    );
  }

  if (
    !Number.isInteger(input.gridSize)
    || input.gridSize < 11
    || input.gridSize > 61
    || input.gridSize % 2 === 0
  ) {
    throw new Error(
      'gridSize debe ser impar y estar entre 11 y 61.',
    );
  }
}

function offsetToGeoPoint(
  center: GeoPoint,
  eastM: number,
  northM: number,
): GeoPoint {
  const latRad =
    center.lat * Math.PI / 180;

  const deltaLatDeg =
    northM
    / EARTH_MEAN_RADIUS_M
    * 180
    / Math.PI;

  const cosLat =
    Math.max(
      Math.cos(latRad),
      1e-8,
    );

  const deltaLngDeg =
    eastM
    / (
      EARTH_MEAN_RADIUS_M
      * cosLat
    )
    * 180
    / Math.PI;

  return {
    lat:
      center.lat + deltaLatDeg,
    lng:
      center.lng + deltaLngDeg,
  };
}

function bearingFromOffsetDeg(
  eastM: number,
  northM: number,
): number {
  const bearing =
    Math.atan2(
      eastM,
      northM,
    )
    * 180
    / Math.PI;

  return (bearing + 360) % 360;
}

function profileHeights(
  model: CoverageInput['propagationModel'],
): {
  bsHeightM: number;
  utHeightM: number;
} {
  switch (model) {
    case 'UMA':
      return {
        bsHeightM: 25,
        utHeightM: 1.5,
      };

    case 'INH_OFFICE':
      return {
        bsHeightM: 3,
        utHeightM: 1,
      };

    case 'UMI_STREET_CANYON':
    case 'FSPL':
    default:
      return {
        bsHeightM: 10,
        utHeightM: 1.5,
      };
  }
}

function createCellPolygon(
  center: GeoPoint,
  eastM: number,
  northM: number,
  halfStepM: number,
): GeoPoint[] {
  return [
    offsetToGeoPoint(
      center,
      eastM - halfStepM,
      northM - halfStepM,
    ),
    offsetToGeoPoint(
      center,
      eastM + halfStepM,
      northM - halfStepM,
    ),
    offsetToGeoPoint(
      center,
      eastM + halfStepM,
      northM + halfStepM,
    ),
    offsetToGeoPoint(
      center,
      eastM - halfStepM,
      northM + halfStepM,
    ),
    offsetToGeoPoint(
      center,
      eastM - halfStepM,
      northM - halfStepM,
    ),
  ];
}

export function generateCoverageGrid(
  input: CoverageInput,
): CoverageResult {
  assertCoverageInput(input);

  const stepM =
    (input.radiusM * 2)
    / (input.gridSize - 1);

  const halfStepM =
    stepM / 2;

  const heights =
    profileHeights(
      input.propagationModel,
    );

  const cells: CoverageCell[] = [];

  let passingCells = 0;
  let failingCells = 0;
  let notEvaluableCells = 0;

  for (
    let row = 0;
    row < input.gridSize;
    row += 1
  ) {
    const northM =
      input.radiusM
      - row * stepM;

    for (
      let column = 0;
      column < input.gridSize;
      column += 1
    ) {
      const eastM =
        -input.radiusM
        + column * stepM;

      const rawDistanceM =
        Math.hypot(
          eastM,
          northM,
        );

      if (
        rawDistanceM
        > input.radiusM
          + halfStepM
      ) {
        continue;
      }

      const distanceM =
        Math.max(
          rawDistanceM,
          1,
        );

      const bearingDeg =
        rawDistanceM < 1e-9
          ? input.antenna.azimuthDeg
          : bearingFromOffsetDeg(
              eastM,
              northM,
            );

      const cellCenter =
        offsetToGeoPoint(
          input.center,
          eastM,
          northM,
        );

      const polygon =
        createCellPolygon(
          input.center,
          eastM,
          northM,
          halfStepM,
        );

      const antenna =
        calculateEffectiveTxGain(
          input.antenna,
          {
            bearingDeg,
            distance2DM:
              distanceM,
            bsHeightM:
              heights.bsHeightM,
            utHeightM:
              heights.utHeightM,
          },
        );

      let pathLossDb:
        | number
        | undefined;

      let note:
        | string
        | undefined;

      if (
        input.propagationModel
        === 'FSPL'
      ) {
        pathLossDb =
          calculateFsplDb(
            distanceM,
            input.radio.frequencyHz,
          );
      } else {
        const propagation =
          calculate3gppPathLoss({
            model:
              input.propagationModel,
            condition:
              input.propagationCondition,
            frequencyHz:
              input.radio.frequencyHz,
            distance2DM:
              distanceM,
          });

        if (
          propagation.isApplicable
          && propagation.pathLossDb
            !== undefined
        ) {
          pathLossDb =
            propagation.pathLossDb;
        } else {
          note =
            propagation.messages.join(
              ' ',
            );
        }
      }

      if (pathLossDb === undefined) {
        notEvaluableCells += 1;

        cells.push({
          id: `${row}-${column}`,
          center: cellCenter,
          polygon,
          distanceM,
          bearingDeg,
          antennaGainDbi:
            antenna.effectiveGainDbi,
          status: 'NOT_EVALUABLE',
          note,
        });

        continue;
      }

      const radio =
        calculateLinkBudgetFromPathLoss(
          {
            ...input.radio,
            distanceM,
            txGainDbi:
              antenna.effectiveGainDbi,
          },
          pathLossDb,
        );

      const passes =
        radio.linkMarginDb !== undefined
        && radio.linkMarginDb >= 0;

      if (passes) {
        passingCells += 1;
      } else {
        failingCells += 1;
      }

      cells.push({
        id: `${row}-${column}`,
        center: cellCenter,
        polygon,
        distanceM,
        bearingDeg,
        antennaGainDbi:
          antenna.effectiveGainDbi,
        pathLossDb:
          radio.pathLossDb,
        receivedPowerDbm:
          radio.receivedPowerDbm,
        snrDb:
          radio.snrDb,
        linkMarginDb:
          radio.linkMarginDb,
        status:
          passes
            ? 'PASS'
            : 'FAIL',
      });
    }
  }

  return {
    cells,
    totalCells:
      cells.length,
    evaluableCells:
      passingCells
      + failingCells,
    passingCells,
    failingCells,
    notEvaluableCells,
    radiusM:
      input.radiusM,
    gridSize:
      input.gridSize,
  };
}
