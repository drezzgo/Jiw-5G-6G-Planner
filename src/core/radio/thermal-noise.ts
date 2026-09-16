import { BOLTZMANN_CONSTANT_J_PER_K } from './constants';
import { assertFinite, assertPositive } from './validation';

/**
 * Thermal noise including receiver noise figure.
 *
 * N(W) = kTB
 * N(dBm) = 10 log10(N(W) / 1 mW) + NF
 *
 * Inputs:
 * - temperatureK: kelvin
 * - bandwidthHz: hertz
 * - noiseFigureDb: dB
 *
 * Output:
 * - dBm
 */
export function calculateThermalNoiseDbm(
  temperatureK: number,
  bandwidthHz: number,
  noiseFigureDb: number,
): number {
  assertPositive(temperatureK, 'temperatureK');
  assertPositive(bandwidthHz, 'bandwidthHz');
  assertFinite(noiseFigureDb, 'noiseFigureDb');

  const thermalNoiseWatts =
    BOLTZMANN_CONSTANT_J_PER_K * temperatureK * bandwidthHz;

  const thermalNoiseDbm =
    10 * Math.log10(thermalNoiseWatts / 1e-3);

  return thermalNoiseDbm + noiseFigureDb;
}
