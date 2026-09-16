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
import { assertFinite } from './validation';

/**
 * Ejecuta el presupuesto de enlace usando una pérdida
 * de trayecto ya calculada.
 *
 * Esto permite que FSPL, 3GPP UMi, UMa, InH u otros
 * modelos alimenten exactamente el mismo Radio Engine.
 */
export function calculateLinkBudgetFromPathLoss(
  input: LinkBudgetInput,
  pathLossDb: number,
): LinkBudgetResult {
  assertFinite(
    pathLossDb,
    'pathLossDb',
  );

  const eirpDbm = calculateEirpDbm(
    input.txPowerDbm,
    input.txGainDbi,
    input.txLossDb,
  );

  const receivedPowerDbm =
    calculateReceivedPowerDbm(
      eirpDbm,
      pathLossDb,
      input.rxGainDbi,
      input.rxLossDb,
    );

  const noisePowerDbm =
    calculateThermalNoiseDbm(
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

/**
 * Mantiene el comportamiento original de las fases
 * anteriores: FSPL como modelo de referencia ideal.
 */
export function calculateLinkBudget(
  input: LinkBudgetInput,
): LinkBudgetResult {
  const pathLossDb = calculateFsplDb(
    input.distanceM,
    input.frequencyHz,
  );

  return calculateLinkBudgetFromPathLoss(
    input,
    pathLossDb,
  );
}
