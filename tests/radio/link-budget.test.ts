import { describe, expect, it } from 'vitest';
import { calculateEirpDbm } from '../../src/core/radio/eirp';
import {
  calculateReceivedPowerDbm,
} from '../../src/core/radio/received-power';
import {
  calculateLinkBudget,
} from '../../src/core/radio/link-budget';

describe('link budget algebra', () => {
  it('matches the Phase 1 EIRP and Prx validation case', () => {
    const eirp = calculateEirpDbm(30, 15, 2);

    expect(eirp).toBe(43);

    const prx = calculateReceivedPowerDbm(
      eirp,
      100,
      0,
      1,
    );

    expect(prx).toBe(-58);
  });

  it('calculates an integrated budget with optional sensitivity', () => {
    const result = calculateLinkBudget({
      frequencyHz: 1e9,
      distanceM: 1_000,
      txPowerDbm: 30,
      txGainDbi: 15,
      txLossDb: 2,
      rxGainDbi: 0,
      rxLossDb: 1,
      bandwidthHz: 100e6,
      temperatureK: 290,
      noiseFigureDb: 7,
      receiverSensitivityDbm: -90,
    });

    expect(result.pathLossDb)
      .toBeCloseTo(92.4477832219, 9);

    expect(result.eirpDbm).toBe(43);

    expect(result.receivedPowerDbm)
      .toBeCloseTo(-50.4477832219, 9);

    expect(result.noisePowerDbm)
      .toBeCloseTo(-86.9751871942, 9);

    expect(result.snrDb)
      .toBeCloseTo(36.5274039723, 9);

    expect(result.linkMarginDb)
      .toBeCloseTo(39.5522167781, 9);

    expect(result.shannonCapacityBps)
      .toBeGreaterThan(0);
  });

  it('omits link margin when no receiver sensitivity is supplied', () => {
    const result = calculateLinkBudget({
      frequencyHz: 1e9,
      distanceM: 1_000,
      txPowerDbm: 30,
      txGainDbi: 15,
      txLossDb: 2,
      rxGainDbi: 0,
      rxLossDb: 1,
      bandwidthHz: 100e6,
      temperatureK: 290,
      noiseFigureDb: 7,
    });

    expect(result.linkMarginDb).toBeUndefined();
  });
});
