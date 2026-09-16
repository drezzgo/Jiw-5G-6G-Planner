/**
 * Contratos del motor RF.
 *
 * Fase 1:
 * - define entradas y salidas;
 * - NO implementa todavía las ecuaciones.
 *
 * Las unidades forman parte del nombre para evitar números ambiguos.
 */

export interface LinkBudgetInput {
  frequencyHz: number;
  distanceM: number;

  txPowerDbm: number;
  txGainDbi: number;
  txLossDb: number;

  rxGainDbi: number;
  rxLossDb: number;

  bandwidthHz: number;
  temperatureK: number;
  noiseFigureDb: number;

  receiverSensitivityDbm?: number;
}

export interface LinkBudgetResult {
  pathLossDb: number;
  eirpDbm: number;
  receivedPowerDbm: number;
  noisePowerDbm: number;
  snrDb: number;
  linkMarginDb?: number;
  shannonCapacityBps: number;
}

export type AssessmentStatus =
  | 'PASS'
  | 'FAIL'
  | 'CONDITIONAL'
  | 'NOT_EVALUABLE';

export type AggregateAssessmentStatus =
  | 'PASS'
  | 'PASS_WITH_WARNINGS'
  | 'FAIL'
  | 'NOT_EVALUABLE';

export type CriterionSeverity = 'CRITICAL' | 'WARNING' | 'INFO';

export type SourceType =
  | 'STANDARD'
  | 'REGULATION'
  | 'MANUFACTURER'
  | 'PROJECT_REQUIREMENT'
  | 'EXPERIMENTAL_PARAMETER'
  | 'CALCULATION'
  | 'RECOMMENDATION'
  | 'ASSUMPTION';

export interface CriterionSource {
  sourceId: string;
  sourceType: SourceType;
  verifiedAt?: string;
}

export interface AssessmentCriterionResult {
  id: string;
  label: string;
  status: AssessmentStatus;
  severity: CriterionSeverity;
  explanation: string;
  source: CriterionSource;

  observedValue?: number | string;
  requiredValue?: number | string;
  unit?: string;

  relatedVariables?: string[];
  remediation?: string;
}
