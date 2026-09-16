import { SPEED_OF_LIGHT_M_PER_S } from './constants';
import { assertPositive } from './validation';

/**
 * Free-Space Path Loss using the physical form:
 *
 * FSPL = 20 log10(4πdf / c)
 *
 * Inputs:
 * - distanceM: metres
 * - frequencyHz: hertz
 *
 * Output:
 * - dB
 *
 * Source contract: ITU-R P.525-5 baseline.
 */
export function calculateFsplDb(
  distanceM: number,
  frequencyHz: number,
): number {
  assertPositive(distanceM, 'distanceM');
  assertPositive(frequencyHz, 'frequencyHz');

  return 20 * Math.log10(
    (4 * Math.PI * distanceM * frequencyHz)
      / SPEED_OF_LIGHT_M_PER_S,
  );
}
