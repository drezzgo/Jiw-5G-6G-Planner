import type {
  AggregateAssessmentStatus,
  AssessmentCriterionResult,
  LinkBudgetResult,
} from '../radio/contracts';
import type {
  AssessmentScenario,
  ProfileAssessment,
} from './types';

const N78_MIN_HZ = 3_300e6;
const N78_MAX_HZ = 3_800e6;

const N78_SCS_30_ALLOWED_BW_MHZ = new Set([
  10, 15, 20, 25, 30, 40,
  50, 60, 70, 80, 90, 100,
]);

const IMT2030_ILLUSTRATIVE_USER_RATE_MBPS = 300;

function aggregate(
  criteria: AssessmentCriterionResult[],
): AggregateAssessmentStatus {
  const critical = criteria.filter(
    (criterion) => criterion.severity === 'CRITICAL',
  );

  if (
    critical.some(
      (criterion) => criterion.status === 'FAIL',
    )
  ) {
    return 'FAIL';
  }

  if (
    critical.some(
      (criterion) =>
        criterion.status === 'NOT_EVALUABLE'
        || criterion.status === 'CONDITIONAL',
    )
  ) {
    return 'NOT_EVALUABLE';
  }

  const hasWarnings = criteria.some(
    (criterion) =>
      criterion.severity === 'WARNING'
      && criterion.status !== 'PASS',
  );

  return hasWarnings ? 'PASS_WITH_WARNINGS' : 'PASS';
}

function blockers(
  criteria: AssessmentCriterionResult[],
): AssessmentCriterionResult[] {
  return criteria.filter(
    (criterion) =>
      criterion.status === 'FAIL'
      || (
        criterion.severity === 'CRITICAL'
        && (
          criterion.status === 'CONDITIONAL'
          || criterion.status === 'NOT_EVALUABLE'
        )
      ),
  );
}

function evaluateRadioLink(
  scenario: AssessmentScenario,
  results: LinkBudgetResult,
): AssessmentCriterionResult {
  if (
    scenario.radio.receiverSensitivityDbm === undefined
    || results.linkMarginDb === undefined
  ) {
    return {
      id: 'radio-link-margin',
      label: 'Viabilidad radio por sensibilidad',
      status: 'NOT_EVALUABLE',
      severity: 'CRITICAL',
      explanation:
        'No se suministró sensibilidad de receptor; no se inventa un umbral universal.',
      source: {
        sourceId: 'SCENARIO_RECEIVER_SENSITIVITY',
        sourceType: 'PROJECT_REQUIREMENT',
      },
    };
  }

  const passes = results.linkMarginDb >= 0;

  return {
    id: 'radio-link-margin',
    label: 'Viabilidad radio por sensibilidad',
    status: passes ? 'PASS' : 'FAIL',
    severity: 'CRITICAL',
    observedValue: results.linkMarginDb,
    requiredValue: '>= 0',
    unit: 'dB',
    explanation: passes
      ? 'La potencia recibida es igual o superior a la sensibilidad definida para este escenario.'
      : 'La potencia recibida está por debajo de la sensibilidad definida para este escenario.',
    remediation: passes
      ? undefined
      : 'Revisar distancia, potencia TX, ganancias, pérdidas o la sensibilidad real del receptor.',
    relatedVariables: [
      'distanceM',
      'txPowerDbm',
      'txGainDbi',
      'txLossDb',
      'rxGainDbi',
      'rxLossDb',
      'receiverSensitivityDbm',
    ],
    source: {
      sourceId: 'SCENARIO_RECEIVER_SENSITIVITY',
      sourceType: 'PROJECT_REQUIREMENT',
    },
  };
}

export function evaluate5gNr(
  scenario: AssessmentScenario,
  results: LinkBudgetResult,
): ProfileAssessment {
  const frequencyHz = scenario.radio.frequencyHz;
  const bandwidthMhz = scenario.radio.bandwidthHz / 1e6;

  const frequencyPass =
    frequencyHz >= N78_MIN_HZ
    && frequencyHz <= N78_MAX_HZ;

  const bandwidthPass =
    N78_SCS_30_ALLOWED_BW_MHZ.has(
      Number(bandwidthMhz.toFixed(6)),
    );

  const criteria: AssessmentCriterionResult[] = [
    {
      id: 'n78-frequency',
      label: 'Frecuencia dentro de banda n78',
      status: frequencyPass ? 'PASS' : 'FAIL',
      severity: 'CRITICAL',
      observedValue: frequencyHz / 1e6,
      requiredValue: '3300–3800',
      unit: 'MHz',
      explanation: frequencyPass
        ? 'La frecuencia configurada se encuentra dentro del rango de operación n78 evaluado.'
        : 'La frecuencia configurada queda fuera del rango n78 del perfil seleccionado.',
      remediation: frequencyPass
        ? undefined
        : 'Usar una frecuencia dentro de 3300–3800 MHz o seleccionar un perfil de banda diferente cuando exista.',
      relatedVariables: ['frequencyHz'],
      source: {
        sourceId: 'ETSI_TS_138_101_1_V18_7_0',
        sourceType: 'STANDARD',
        verifiedAt: '2026-09-16',
      },
    },
    {
      id: 'n78-duplex',
      label: 'Modo dúplex n78',
      status:
        scenario.technology.duplexMode === 'TDD'
          ? 'PASS'
          : 'FAIL',
      severity: 'CRITICAL',
      observedValue: scenario.technology.duplexMode,
      requiredValue: 'TDD',
      explanation:
        'El perfil n78 evaluado utiliza TDD.',
      source: {
        sourceId: 'ETSI_TS_138_101_1_V18_7_0',
        sourceType: 'STANDARD',
        verifiedAt: '2026-09-16',
      },
    },
    {
      id: 'n78-bandwidth-scs30',
      label: 'Bandwidth para n78 con SCS 30 kHz',
      status: bandwidthPass ? 'PASS' : 'FAIL',
      severity: 'CRITICAL',
      observedValue: bandwidthMhz,
      requiredValue:
        '10, 15, 20, 25, 30, 40, 50, 60, 70, 80, 90 o 100',
      unit: 'MHz',
      explanation: bandwidthPass
        ? 'El bandwidth coincide con uno de los valores admitidos por el perfil n78 / SCS 30 kHz fijado para esta calculadora.'
        : 'El bandwidth no coincide con los valores admitidos por el perfil n78 / SCS 30 kHz evaluado.',
      remediation: bandwidthPass
        ? undefined
        : 'Seleccionar un bandwidth soportado por el perfil n78 / SCS 30 kHz.',
      relatedVariables: ['bandwidthHz'],
      source: {
        sourceId: 'ETSI_TS_138_101_1_V18_7_0',
        sourceType: 'STANDARD',
        verifiedAt: '2026-09-16',
      },
    },
    evaluateRadioLink(scenario, results),
    {
      id: 'snr-information',
      label: 'SNR calculado',
      status: 'CONDITIONAL',
      severity: 'INFO',
      observedValue: results.snrDb,
      unit: 'dB',
      explanation:
        'Se muestra como resultado físico. Esta fase no asigna un umbral universal de SNR a 5G NR ni deduce automáticamente MCS/CQI.',
      source: {
        sourceId: 'RADIO_ENGINE_CALCULATION',
        sourceType: 'CALCULATION',
      },
    },
    {
      id: 'shannon-information',
      label: 'Capacidad teórica de Shannon',
      status: 'CONDITIONAL',
      severity: 'INFO',
      observedValue: results.shannonCapacityBps / 1e6,
      unit: 'Mbit/s',
      explanation:
        'Es un límite teórico del modelo de canal y no throughput real 5G.',
      source: {
        sourceId: 'SHANNON_1948',
        sourceType: 'STANDARD',
      },
    },
  ];

  return {
    profile: '5G_NR',
    label: 'Perfil 5G NR n78',
    aggregateStatus: aggregate(criteria),
    criteria,
    blockers: blockers(criteria),
    results,
  };
}

export function evaluateImt2030(
  scenario: AssessmentScenario,
  results: LinkBudgetResult,
): ProfileAssessment {
  const capacityMbps =
    results.shannonCapacityBps / 1e6;

  const belowIllustrativeTarget =
    capacityMbps
    < IMT2030_ILLUSTRATIVE_USER_RATE_MBPS;

  const criteria: AssessmentCriterionResult[] = [
    evaluateRadioLink(scenario, results),
    {
      id: 'imt2030-frequency',
      label: 'Banda/frecuencia IMT-2030',
      status: 'NOT_EVALUABLE',
      severity: 'INFO',
      observedValue:
        scenario.radio.frequencyHz / 1e6,
      unit: 'MHz',
      explanation:
        'M.2160 es un marco de IMT-2030 y no define para esta calculadora una banda comercial final equivalente a n78. No se inventa una regla de frecuencia 6G.',
      source: {
        sourceId: 'ITU_R_M_2160_0_2023',
        sourceType: 'STANDARD',
        verifiedAt: '2026-09-16',
      },
    },
    {
      id: 'imt2030-capacity-screening',
      label: 'Screening de capacidad frente a referencia IMT-2030',
      status: belowIllustrativeTarget
        ? 'FAIL'
        : 'CONDITIONAL',
      severity: 'CRITICAL',
      observedValue: capacityMbps,
      requiredValue:
        '>= 300 como referencia ilustrativa, no requisito mínimo final',
      unit: 'Mbit/s',
      explanation: belowIllustrativeTarget
        ? 'Incluso el límite teórico de Shannon del escenario queda por debajo del ejemplo de 300 Mbit/s citado por ITU-R M.2160 para user experienced data rate. Bajo este modelo, el escenario no puede alcanzar esa referencia.'
        : 'El límite teórico de Shannon supera 300 Mbit/s, pero eso NO demuestra user experienced data rate ni cumplimiento IMT-2030. Por eso el resultado es condicional.',
      remediation: belowIllustrativeTarget
        ? 'Revisar bandwidth, SNR y condiciones del enlace; después validar desempeño con un modelo y métricas apropiadas.'
        : undefined,
      relatedVariables: [
        'bandwidthHz',
        'snrDb',
        'receivedPowerDbm',
        'noisePowerDbm',
      ],
      source: {
        sourceId: 'ITU_R_M_2160_0_2023',
        sourceType: 'STANDARD',
        verifiedAt: '2026-09-16',
      },
    },
    {
      id: 'imt2030-final-compliance',
      label: 'Cumplimiento 6G final',
      status: 'NOT_EVALUABLE',
      severity: 'INFO',
      explanation:
        'La aplicación no declara certificación ni cumplimiento de una interfaz radio 6G final. IMT-2030 continúa su proceso de especificación y evaluación.',
      source: {
        sourceId: 'ITU_IMT2030_WP5D_2026',
        sourceType: 'STANDARD',
        verifiedAt: '2026-09-16',
      },
    },
  ];

  return {
    profile: 'IMT2030_EXPERIMENTAL',
    label: 'IMT-2030 experimental',
    aggregateStatus: aggregate(criteria),
    criteria,
    blockers: blockers(criteria),
    results,
  };
}
