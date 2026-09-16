import { describe, expect, it } from 'vitest';
import {
  calculateShannonCapacityBps,
  snrDbToLinear,
} from '../../src/core/radio/shannon';

describe('Shannon capacity', () => {
  it('converts 10 dB SNR to a linear ratio of 10', () => {
    expect(snrDbToLinear(10)).toBeCloseTo(10, 12);
  });

  it('matches the Phase 1 validation case', () => {
    const result = calculateShannonCapacityBps(
      100e6,
      10,
    );

    expect(result).toBeCloseTo(
      345_943_161.8637298,
      3,
    );
  });
});
