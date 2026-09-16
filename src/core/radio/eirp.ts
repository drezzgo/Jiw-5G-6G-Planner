import { assertFinite, assertNonNegative } from './validation';

/**
 * EIRP = Ptx + Gtx - Ltx
 *
 * Units:
 * - txPowerDbm: dBm
 * - txGainDbi: dBi
 * - txLossDb: dB
 * - result: dBm
 */
export function calculateEirpDbm(
  txPowerDbm: number,
  txGainDbi: number,
  txLossDb: number,
): number {
  assertFinite(txPowerDbm, 'txPowerDbm');
  assertFinite(txGainDbi, 'txGainDbi');
  assertNonNegative(txLossDb, 'txLossDb');

  return txPowerDbm + txGainDbi - txLossDb;
}
