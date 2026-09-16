import {
  describe,
  expect,
  it,
} from 'vitest';

import {
  generateCoverageGrid,
} from '../../src/core/coverage';

const baseInput = {
  center: {
    lat: 4.711,
    lng: -74.0721,
  },
  radiusM: 100,
  gridSize: 11,
  radio: {
    frequencyHz: 3.5e9,
    distanceM: 100,
    txPowerDbm: 30,
    txGainDbi: 15,
    txLossDb: 2,
    rxGainDbi: 0,
    rxLossDb: 1,
    bandwidthHz: 100e6,
    temperatureK: 290,
    noiseFigureDb: 7,
    receiverSensitivityDbm: -90,
  },
  propagationModel:
    'FSPL' as const,
  propagationCondition:
    'LOS' as const,
};

describe('coverage grid', () => {
  it('generates an evaluable circular grid with fixed gain', () => {
    const result =
      generateCoverageGrid({
        ...baseInput,
        antenna: {
          mode: 'FIXED_GAIN',
          fixedGainDbi: 15,
          azimuthDeg: 90,
          downtiltDeg: 0,
        },
      });

    expect(result.cells.length)
      .toBeGreaterThan(50);

    expect(result.evaluableCells)
      .toBe(result.totalCells);

    expect(
      result.cells.every(
        (cell) =>
          cell.antennaGainDbi === 15,
      ),
    ).toBe(true);
  });

  it('produces different gains around a directional element', () => {
    const result =
      generateCoverageGrid({
        ...baseInput,
        antenna: {
          mode:
            'THREE_GPP_SINGLE_ELEMENT',
          fixedGainDbi: 15,
          azimuthDeg: 90,
          downtiltDeg: 5,
        },
      });

    const gains =
      result.cells
        .map(
          (cell) =>
            cell.antennaGainDbi,
        )
        .filter(
          (
            value,
          ): value is number =>
            value !== undefined,
        );

    expect(
      Math.max(...gains)
      - Math.min(...gains),
    ).toBeGreaterThan(10);
  });

  it('marks UMi cells below the documented minimum distance as not evaluable instead of extrapolating', () => {
    const result =
      generateCoverageGrid({
        ...baseInput,
        radiusM: 30,
        gridSize: 11,
        propagationModel:
          'UMI_STREET_CANYON',
        antenna: {
          mode: 'FIXED_GAIN',
          fixedGainDbi: 15,
          azimuthDeg: 90,
          downtiltDeg: 0,
        },
      });

    expect(
      result.notEvaluableCells,
    ).toBeGreaterThan(0);
  });

  it('rejects even grid sizes', () => {
    expect(() =>
      generateCoverageGrid({
        ...baseInput,
        gridSize: 20,
        antenna: {
          mode: 'FIXED_GAIN',
          fixedGainDbi: 15,
          azimuthDeg: 90,
          downtiltDeg: 0,
        },
      }),
    ).toThrow();
  });
});
