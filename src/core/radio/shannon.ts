import { RadioModelError } from './errors';
import { assertFinite, assertPositive } from './validation';

/**
 * Converts SNR from dB to linear ratio.
 */
export function snrDbToLinear(snrDb: number): number {
  assertFinite(snrDb, 'snrDb');

  const linear = 10 ** (snrDb / 10);

  if (!Number.isFinite(linear)) {
    throw new RadioModelError(
      'snrDb produces a non-finite linear SNR.',
    );
  }

  return linear;
}

/**
 * Shannon theoretical channel capacity:
 *
 * C = B log2(1 + SNRlinear)
 *
 * This is NOT actual 5G throughput.
 */
export function calculateShannonCapacityBps(
  bandwidthHz: number,
  snrDb: number,
): number {
  assertPositive(bandwidthHz, 'bandwidthHz');

  const snrLinear = snrDbToLinear(snrDb);
  const capacityBps =
    bandwidthHz * Math.log2(1 + snrLinear);

  if (!Number.isFinite(capacityBps)) {
    throw new RadioModelError(
      'Shannon capacity calculation produced a non-finite result.',
    );
  }

  return capacityBps;
}
