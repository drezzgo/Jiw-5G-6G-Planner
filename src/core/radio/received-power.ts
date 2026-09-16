import { assertFinite, assertNonNegative } from './validation';

/**
 * Prx = EIRP - PathLoss + Grx - Lrx
 *
 * Units:
 * - eirpDbm: dBm
 * - pathLossDb: dB
 * - rxGainDbi: dBi
 * - rxLossDb: dB
 * - result: dBm
 */
export function calculateReceivedPowerDbm(
  eirpDbm: number,
  pathLossDb: number,
  rxGainDbi: number,
  rxLossDb: number,
): number {
  assertFinite(eirpDbm, 'eirpDbm');
  assertFinite(pathLossDb, 'pathLossDb');
  assertFinite(rxGainDbi, 'rxGainDbi');
  assertNonNegative(rxLossDb, 'rxLossDb');

  return eirpDbm - pathLossDb + rxGainDbi - rxLossDb;
}
