import {
  describe,
  expect,
  it,
} from 'vitest';

import {
  analyzeTerrainProfile,
  calculateFirstFresnelRadiusM,
  generateTerrainSamplePoints,
  interpolateGreatCirclePoint,
  recommendedTerrainSampleCount,
} from '../../src/core/terrain';

describe('terrain and Fresnel core', () => {
  it('returns endpoints in great-circle interpolation', () => {
    const from = {
      lat: 4.7,
      lng: -74.1,
    };

    const to = {
      lat: 4.8,
      lng: -74.0,
    };

    expect(
      interpolateGreatCirclePoint(
        from,
        to,
        0,
      ),
    ).toEqual(from);

    expect(
      interpolateGreatCirclePoint(
        from,
        to,
        1,
      ),
    ).toEqual(to);
  });

  it('uses a sample count compatible with the 90 m DEM and API limit', () => {
    expect(
      recommendedTerrainSampleCount(
        5_000,
      ),
    ).toBe(57);

    expect(
      recommendedTerrainSampleCount(
        50_000,
      ),
    ).toBe(100);

    expect(
      recommendedTerrainSampleCount(
        100,
      ),
    ).toBe(21);
  });

  it('calculates first Fresnel radius at midpoint of a 1 km 3.5 GHz link', () => {
    const radius =
      calculateFirstFresnelRadiusM(
        3.5e9,
        500,
        500,
      );

    expect(radius)
      .toBeCloseTo(
        4.627,
        3,
      );
  });

  it('generates the requested number of geographic samples', () => {
    const points =
      generateTerrainSamplePoints(
        {
          lat: 4.7,
          lng: -74.1,
        },
        {
          lat: 4.71,
          lng: -74.09,
        },
        1_000,
        21,
      );

    expect(points).toHaveLength(21);
    expect(points[0].distanceM).toBe(0);
    expect(
      points[20].distanceM,
    ).toBe(1_000);
  });

  it('detects clear terrain and 60% Fresnel clearance on a flat profile', () => {
    const samples =
      Array.from(
        {
          length: 11,
        },
        (_, index) => ({
          point: {
            lat: 0,
            lng:
              index / 10,
          },
          distanceM:
            index * 100,
          elevationM:
            2_600,
        }),
      );

    const result =
      analyzeTerrainProfile(
        samples,
        3.5e9,
        10,
        10,
      );

    expect(
      result.geometricLosClear,
    ).toBe(true);

    expect(
      result.fresnel60Clear,
    ).toBe(true);

    expect(
      result.maximumFresnelRadiusM,
    ).toBeCloseTo(
      4.627,
      3,
    );
  });

  it('detects terrain obstruction', () => {
    const samples =
      Array.from(
        {
          length: 11,
        },
        (_, index) => ({
          point: {
            lat: 0,
            lng:
              index / 10,
          },
          distanceM:
            index * 100,
          elevationM:
            index === 5
              ? 2_620
              : 2_600,
        }),
      );

    const result =
      analyzeTerrainProfile(
        samples,
        3.5e9,
        10,
        10,
      );

    expect(
      result.geometricLosClear,
    ).toBe(false);

    expect(
      result.minimumTerrainClearanceM,
    ).toBeLessThan(0);
  });
});
