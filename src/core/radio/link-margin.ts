import { assertFinite } from './validation';

/**
 * Margin(dB) = Prx(dBm) - Sensitivity(dBm)
 */
export function calculateLinkMarginDb(
  receivedPowerDbm: number,
  receiverSensitivityDbm: number,
): number {
  assertFinite(receivedPowerDbm, 'receivedPowerDbm');
  assertFinite(receiverSensitivityDbm, 'receiverSensitivityDbm');

  return receivedPowerDbm - receiverSensitivityDbm;
}
