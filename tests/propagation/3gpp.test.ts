import {
  describe,
  expect,
  it,
} from 'vitest';

import {
  calculate3gppPathLoss,
} from '../../src/core/propagation';

describe('3GPP TR 38.901 path loss', () => {
  it('matches UMi LOS at 100 m and 3.5 GHz', () => {
    const result = calculate3gppPathLoss({
      model: 'UMI_STREET_CANYON',
      condition: 'LOS',
      frequencyHz: 3.5e9,
      distance2DM: 100,
    });

    expect(result.isApplicable).toBe(true);

    expect(result.breakpointDistanceM)
      .toBeCloseTo(210, 9);

    expect(result.pathLossDb)
      .toBeCloseTo(
        85.3141891025,
        8,
      );
  });

  it('matches UMi NLOS and applies max(LOS, NLOS candidate)', () => {
    const result = calculate3gppPathLoss({
      model: 'UMI_STREET_CANYON',
      condition: 'NLOS',
      frequencyHz: 3.5e9,
      distance2DM: 100,
    });

    expect(result.pathLossDb)
      .toBeCloseTo(
        104.6438320117,
        8,
      );
  });

  it('matches UMa LOS with the default 25 m / 1.5 m heights', () => {
    const result = calculate3gppPathLoss({
      model: 'UMA',
      condition: 'LOS',
      frequencyHz: 3.5e9,
      distance2DM: 100,
    });

    expect(result.breakpointDistanceM)
      .toBeCloseTo(560, 9);

    expect(result.pathLossDb)
      .toBeCloseTo(
        83.1381566769,
        8,
      );
  });

  it('matches InH Office NLOS at 30 m horizontal distance', () => {
    const result = calculate3gppPathLoss({
      model: 'INH_OFFICE',
      condition: 'NLOS',
      frequencyHz: 3.5e9,
      distance2DM: 30,
    });

    expect(result.distance3DM)
      .toBeCloseTo(
        30.0665927567,
        8,
      );

    expect(result.pathLossDb)
      .toBeCloseTo(
        87.4579197479,
        8,
      );
  });

  it('does not extrapolate UMi beyond 5 km', () => {
    const result = calculate3gppPathLoss({
      model: 'UMI_STREET_CANYON',
      condition: 'LOS',
      frequencyHz: 3.5e9,
      distance2DM: 5_001,
    });

    expect(result.isApplicable).toBe(false);
    expect(result.pathLossDb).toBeUndefined();
  });

  it('does not extrapolate InH beyond 150 m 3D', () => {
    const result = calculate3gppPathLoss({
      model: 'INH_OFFICE',
      condition: 'LOS',
      frequencyHz: 3.5e9,
      distance2DM: 150,
    });

    expect(result.distance3DM)
      .toBeGreaterThan(150);

    expect(result.isApplicable).toBe(false);
    expect(result.pathLossDb).toBeUndefined();
  });
});
