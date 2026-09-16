import {
  describe,
  expect,
  it,
} from 'vitest';

import {
  evaluateImt2030Experiment,
} from '../../src/core/imt2030';

describe('IMT-2030 experimental evaluator', () => {
  it('places 100 MHz and 10 dB between 300 and 500 Mbit/s', () => {
    const result =
      evaluateImt2030Experiment({
        bandwidthHz: 100e6,
        snrDb: 10,
      });

    expect(
      result.theoreticalCapacityBps
      / 1e6,
    ).toBeCloseTo(
      345.9431618637,
      8,
    );

    expect(
      result.userRateScreening,
    ).toBe(
      'BETWEEN_300_500',
    );
  });

  it('detects a theoretical limit below 300 Mbit/s', () => {
    const result =
      evaluateImt2030Experiment({
        bandwidthHz: 100e6,
        snrDb: 5,
      });

    expect(
      result.theoreticalCapacityBps
      / 1e6,
    ).toBeLessThan(300);

    expect(
      result.userRateScreening,
    ).toBe('BELOW_300');
  });

  it('detects a theoretical limit above 500 Mbit/s', () => {
    const result =
      evaluateImt2030Experiment({
        bandwidthHz: 100e6,
        snrDb: 20,
      });

    expect(
      result.theoreticalCapacityBps
      / 1e6,
    ).toBeCloseTo(
      665.8211482752,
      8,
    );

    expect(
      result.userRateScreening,
    ).toBe(
      'AT_OR_ABOVE_500',
    );
  });

  it('keeps latency as not evaluable', () => {
    const result =
      evaluateImt2030Experiment({
        bandwidthHz: 100e6,
        snrDb: 10,
      });

    const latency =
      result.capabilities.find(
        (capability) =>
          capability.id
          === 'latency',
      );

    expect(latency?.status)
      .toBe('NOT_EVALUABLE');
  });

  it('rejects invalid bandwidth', () => {
    expect(() =>
      evaluateImt2030Experiment({
        bandwidthHz: 0,
        snrDb: 10,
      }),
    ).toThrow();
  });
});
