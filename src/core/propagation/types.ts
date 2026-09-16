export type PropagationModelId =
  | 'FSPL'
  | 'UMI_STREET_CANYON'
  | 'UMA'
  | 'INH_OFFICE';

export type PropagationCondition =
  | 'LOS'
  | 'NLOS';

export interface PropagationInput {
  model: Exclude<PropagationModelId, 'FSPL'>;
  condition: PropagationCondition;
  frequencyHz: number;
  distance2DM: number;
}

export interface PropagationResult {
  model: Exclude<PropagationModelId, 'FSPL'>;
  condition: PropagationCondition;
  isApplicable: boolean;

  pathLossDb?: number;
  distance2DM: number;
  distance3DM: number;

  bsHeightM: number;
  utHeightM: number;
  breakpointDistanceM?: number;

  formulaId: string;
  sourceId: '3GPP_TR_38_901_R19_4_0';
  sourceLocator: string;

  messages: string[];
}
