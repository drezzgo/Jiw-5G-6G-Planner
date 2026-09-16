import { describe, expect, it } from 'vitest';
import {
  calculateShannonCapacityBps,
} from '../../src/core/radio/shannon';
import {
  calculateThermalNoiseDbm,
} from '../../src/core/radio/thermal-noise';

describe('radio input validation', () => {
  it('rejects non-positive bandwidth', () => {
    expect(() =>
      calculateShannonCapacityBps(0, 10),
    ).toThrow();
  });

  it('rejects non-positive temperature', () => {
    expect(() =>
      calculateThermalNoiseDbm(
        0,
        100e6,
        7,
      ),
    ).toThrow();
  });

  it('rejects NaN', () => {
    expect(() =>
      calculateShannonCapacityBps(
        Number.NaN,
        10,
      ),
    ).toThrow();
  });
});
