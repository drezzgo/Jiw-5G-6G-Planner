import type {
  AggregateAssessmentStatus,
  AssessmentCriterionResult,
  LinkBudgetInput,
  LinkBudgetResult,
} from '../radio/contracts';

export type AssessmentProfile =
  | '5G_NR'
  | 'IMT2030_EXPERIMENTAL';

export interface TechnologyProfileInput {
  bandId: 'n78';
  duplexMode: 'TDD';
  architecture: 'SA';
  scsKhz: 30;
}

export interface AssessmentScenario {
  radio: LinkBudgetInput;
  technology: TechnologyProfileInput;
}

export interface ProfileAssessment {
  profile: AssessmentProfile;
  label: string;
  aggregateStatus: AggregateAssessmentStatus;
  criteria: AssessmentCriterionResult[];
  blockers: AssessmentCriterionResult[];
  results: LinkBudgetResult;
}
