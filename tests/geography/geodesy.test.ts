import {
  describe,
  expect,
  it,
} from 'vitest';

import {
  bearingToCardinal,
  calculateGreatCircleDistanceM,
  calculateInitialBearingDeg,
} from '../../src/core/geography';

describe('geodesy', () => {
  it('returns zero for coincident points', () => {
    const point = {lat: 4.7, lng: -74.0};

    expect(
      calculateGreatCircleDistanceM(
        point,
        point,
      ),
    ).toBe(0);

    expect(
      calculateInitialBearingDeg(
        point,
        point,
      ),
    ).toBeNull();
  });

  it('approximates one degree of longitude at the equator', () => {
    const result = calculateGreatCircleDistanceM(
      {lat: 0, lng: 0},
      {lat: 0, lng: 1},
    );

    expect(result).toBeCloseTo(
      111_195.08,
      0,
    );
  });

  it('returns east for a point due east at the equator', () => {
    const bearing = calculateInitialBearingDeg(
      {lat: 0, lng: 0},
      {lat: 0, lng: 1},
    );

    expect(bearing).toBeCloseTo(90, 8);
    expect(bearingToCardinal(bearing)).toBe('E');
  });

  it('validates coordinate ranges', () => {
    expect(() =>
      calculateGreatCircleDistanceM(
        {lat: 91, lng: 0},
        {lat: 0, lng: 0},
      ),
    ).toThrow();

    expect(() =>
      calculateInitialBearingDeg(
        {lat: 0, lng: -181},
        {lat: 0, lng: 0},
      ),
    ).toThrow();
  });
});
