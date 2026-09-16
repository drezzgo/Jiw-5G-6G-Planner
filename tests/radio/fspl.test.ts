import { describe, expect, it } from 'vitest';
import { calculateFsplDb } from '../../src/core/radio/fspl';

describe('calculateFsplDb', () => {
  it('matches the Phase 1 validation case at 1 km and 1 GHz', () => {
    const result = calculateFsplDb(1_000, 1e9);

    expect(result).toBeCloseTo(92.4477832219, 9);
  });

  it('rejects zero distance', () => {
    expect(() => calculateFsplDb(0, 1e9)).toThrow();
  });

  it('rejects zero frequency', () => {
    expect(() => calculateFsplDb(1_000, 0)).toThrow();
  });
});
