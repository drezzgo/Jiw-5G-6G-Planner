import {
  describe,
  expect,
  it,
} from 'vitest';

import {
  calculate3gppElementPatternGain,
  calculateEffectiveTxGain,
  normalizeSignedAngleDeg,
} from '../../src/core/antennas';

describe('3GPP antenna element pattern', () => {
  it('returns 8 dBi at boresight', () => {
    const result =
      calculate3gppElementPatternGain(
        0,
        0,
      );

    expect(result.gainDbi).toBe(8);
    expect(result.attenuationDb).toBe(0);
  });

  it('applies 12 dB attenuation at one 65 degree horizontal beamwidth offset', () => {
    const result =
      calculate3gppElementPatternGain(
        65,
        0,
      );

    expect(result.attenuationDb)
      .toBeCloseTo(-12, 12);

    expect(result.gainDbi)
      .toBeCloseTo(-4, 12);
  });

  it('limits combined attenuation to 30 dB', () => {
    const result =
      calculate3gppElementPatternGain(
        180,
        90,
      );

    expect(result.attenuationDb)
      .toBe(-30);

    expect(result.gainDbi)
      .toBe(-22);
  });

  it('normalizes azimuth offsets to -180..180 degrees', () => {
    expect(
      normalizeSignedAngleDeg(270),
    ).toBe(-90);

    expect(
      normalizeSignedAngleDeg(-270),
    ).toBe(90);
  });

  it('keeps fixed gain unchanged regardless of orientation', () => {
    const result =
      calculateEffectiveTxGain(
        {
          mode: 'FIXED_GAIN',
          fixedGainDbi: 15,
          azimuthDeg: 0,
          downtiltDeg: 0,
        },
        {
          bearingDeg: 180,
          distance2DM: 500,
          bsHeightM: 10,
          utHeightM: 1.5,
        },
      );

    expect(result.effectiveGainDbi)
      .toBe(15);
  });

  it('reaches boresight when azimuth and downtilt match the target geometry', () => {
    const depressionAngleDeg =
      Math.atan2(8.5, 100)
      * 180
      / Math.PI;

    const result =
      calculateEffectiveTxGain(
        {
          mode:
            'THREE_GPP_SINGLE_ELEMENT',
          fixedGainDbi: 15,
          azimuthDeg: 90,
          downtiltDeg:
            depressionAngleDeg,
        },
        {
          bearingDeg: 90,
          distance2DM: 100,
          bsHeightM: 10,
          utHeightM: 1.5,
        },
      );

    expect(result.effectiveGainDbi)
      .toBeCloseTo(8, 10);
  });
});
