import { describe, expect, it } from 'vitest';
import {
  calculateThermalNoiseDbm,
} from '../../src/core/radio/thermal-noise';

describe('calculateThermalNoiseDbm', () => {
  it('derives approximately -173.975 dBm in 1 Hz at 290 K', () => {
    const result = calculateThermalNoiseDbm(
      290,
      1,
      0,
    );

    expect(result).toBeCloseTo(-173.9751871942, 9);
  });

  it('matches the 100 MHz, 290 K, 7 dB NF validation case', () => {
    const result = calculateThermalNoiseDbm(
      290,
      100e6,
      7,
    );

    expect(result).toBeCloseTo(-86.9751871942, 9);
  });
});
