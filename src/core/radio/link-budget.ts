import type {
  LinkBudgetInput,
  LinkBudgetResult,
} from './contracts';

import { calculateFsplDb } from './fspl';
import { calculateEirpDbm } from './eirp';
import { calculateReceivedPowerDbm } from './received-power';
import { calculateThermalNoiseDbm } from './thermal-noise';
import { calculateSnrDb } from './snr';
import { calculateLinkMarginDb } from './link-margin';
import { calculateShannonCapacityBps } from './shannon';

/**
 * Orchestrates the MVP radio link budget.
 *
 * Important:
 * - does not determine 5G compliance;
 * - does not select modulation/MCS;
 * - does not model interference;
 * - does not decide IMT-2030 alignment.
 *
 * It only returns mathematical radio results.
 */
export function calculateLinkBudget(
  input: LinkBudgetInput,
): LinkBudgetResult {
  const pathLossDb = calculateFsplDb(
    input.distanceM,
    input.frequencyHz,
  );

  const eirpDbm = calculateEirpDbm(
    input.txPowerDbm,
    input.txGainDbi,
    input.txLossDb,
  );

  const receivedPowerDbm = calculateReceivedPowerDbm(
    eirpDbm,
    pathLossDb,
    input.rxGainDbi,
    input.rxLossDb,
  );

  const noisePowerDbm = calculateThermalNoiseDbm(
    input.temperatureK,
    input.bandwidthHz,
    input.noiseFigureDb,
  );

  const snrDb = calculateSnrDb(
    receivedPowerDbm,
    noisePowerDbm,
  );

  const linkMarginDb =
    input.receiverSensitivityDbm === undefined
      ? undefined
      : calculateLinkMarginDb(
          receivedPowerDbm,
          input.receiverSensitivityDbm,
        );

  const shannonCapacityBps =
    calculateShannonCapacityBps(
      input.bandwidthHz,
      snrDb,
    );

  return {
    pathLossDb,
    eirpDbm,
    receivedPowerDbm,
    noisePowerDbm,
    snrDb,
    linkMarginDb,
    shannonCapacityBps,
  };
}
