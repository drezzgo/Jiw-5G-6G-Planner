import { assertFinite } from './validation';

/**
 * SNR(dB) = Prx(dBm) - Noise(dBm)
 */
export function calculateSnrDb(
  receivedPowerDbm: number,
  noisePowerDbm: number,
): number {
  assertFinite(receivedPowerDbm, 'receivedPowerDbm');
  assertFinite(noisePowerDbm, 'noisePowerDbm');

  return receivedPowerDbm - noisePowerDbm;
}
