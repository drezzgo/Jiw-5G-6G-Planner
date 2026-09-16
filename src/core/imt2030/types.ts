export type Imt2030CapabilityStatus =
  | 'PARTIAL'
  | 'NOT_EVALUABLE';

export type UserRateScreening =
  | 'BELOW_300'
  | 'BETWEEN_300_500'
  | 'AT_OR_ABOVE_500';

export interface Imt2030ExperimentInput {
  bandwidthHz: number;
  snrDb: number;
}

export interface Imt2030Capability {
  id: string;
  title: string;
  reference: string;
  status: Imt2030CapabilityStatus;
  explanation: string;
}

export interface Imt2030ExperimentResult {
  bandwidthHz: number;
  snrDb: number;

  theoreticalCapacityBps: number;
  theoreticalSpectralEfficiencyBpsHz: number;

  userRateScreening:
    UserRateScreening;

  interpretation: string;

  capabilities:
    Imt2030Capability[];
}
