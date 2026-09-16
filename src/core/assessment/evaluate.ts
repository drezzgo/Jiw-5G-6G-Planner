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
    (criterion) =>
      criterion.severity === 'CRITICAL',
  );

  if (
    critical.some(
      (criterion) =>
        criterion.status === 'FAIL',
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

  return hasWarnings
    ? 'PASS_WITH_WARNINGS'
    : 'PASS';
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
    scenario.radio.receiverSensitivityDbm
      === undefined
    || results.linkMarginDb
      === undefined
  ) {
    return {
      id: 'radio-link-margin',
      label:
        'Margen respecto a la sensibilidad del receptor',
      status: 'NOT_EVALUABLE',
      severity: 'CRITICAL',
      explanation:
        'No definimos una sensibilidad para el receptor, por lo que no podemos comparar la potencia recibida con un valor mínimo del escenario. Preferimos dejar este criterio como no evaluable en lugar de asumir un umbral universal para 5G.',
      source: {
        sourceId:
          'SCENARIO_RECEIVER_SENSITIVITY',
        sourceType:
          'PROJECT_REQUIREMENT',
      },
    };
  }

  const passes =
    results.linkMarginDb >= 0;

  return {
    id: 'radio-link-margin',
    label:
      'Margen respecto a la sensibilidad del receptor',
    status:
      passes ? 'PASS' : 'FAIL',
    severity: 'CRITICAL',
    observedValue:
      results.linkMarginDb,
    requiredValue: '>= 0',
    unit: 'dB',
    explanation: passes
      ? 'La potencia que estimamos en el receptor queda por encima de la sensibilidad configurada. En términos sencillos, con estos parámetros existe margen para que la señal alcance el nivel mínimo que definimos para el receptor. Este criterio solo evalúa el presupuesto de enlace; no demuestra por sí solo que una red 5G completa vaya a conectarse o mantener servicio.'
      : 'La potencia que estimamos en el receptor queda por debajo de la sensibilidad configurada. Esto significa que, con los parámetros actuales, la señal llegaría con menos potencia de la que usamos como mínimo para este receptor y por eso el enlace no pasa este criterio.',
    remediation: passes
      ? undefined
      : 'Podemos revisar la distancia, la potencia de transmisión, las ganancias y pérdidas de antena o utilizar la sensibilidad real del equipo que queramos evaluar.',
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
      sourceId:
        'SCENARIO_RECEIVER_SENSITIVITY',
      sourceType:
        'PROJECT_REQUIREMENT',
    },
  };
}

export function evaluate5gNr(
  scenario: AssessmentScenario,
  results: LinkBudgetResult,
): ProfileAssessment {
  const frequencyHz =
    scenario.radio.frequencyHz;

  const bandwidthMhz =
    scenario.radio.bandwidthHz
    / 1e6;

  const frequencyPass =
    frequencyHz >= N78_MIN_HZ
    && frequencyHz <= N78_MAX_HZ;

  const bandwidthPass =
    N78_SCS_30_ALLOWED_BW_MHZ.has(
      Number(
        bandwidthMhz.toFixed(6),
      ),
    );

  const tddPass =
    scenario.technology.duplexMode
      === 'TDD';

  const criteria:
    AssessmentCriterionResult[] = [
      {
        id: 'n78-frequency',
        label:
          'Frecuencia compatible con la banda n78',
        status:
          frequencyPass
            ? 'PASS'
            : 'FAIL',
        severity: 'CRITICAL',
        observedValue:
          frequencyHz / 1e6,
        requiredValue:
          '3300–3800',
        unit: 'MHz',
        explanation: frequencyPass
          ? 'La frecuencia configurada está dentro del rango de 3300 a 3800 MHz que usamos para la banda n78 según el perfil 3GPP/ETSI. Esto significa que, para este criterio técnico, la frecuencia sí es compatible con n78. La autorización y disponibilidad de espectro en Colombia se revisan aparte, porque estar dentro de n78 no equivale por sí solo a tener permiso para transmitir.'
          : 'La frecuencia configurada queda fuera de 3300 a 3800 MHz. Por eso no corresponde al perfil n78 que estamos evaluando y este criterio falla, aunque el presupuesto de enlace pudiera arrojar una potencia recibida favorable.',
        remediation:
          frequencyPass
            ? undefined
            : 'Podemos usar una frecuencia dentro del rango n78 o, si queremos estudiar otra banda, crear un perfil técnico específico para ella.',
        relatedVariables: [
          'frequencyHz',
        ],
        source: {
          sourceId:
            'ETSI_TS_138_101_1_V18_7_0',
          sourceType: 'STANDARD',
          verifiedAt:
            '2026-09-16',
        },
      },
      {
        id: 'n78-duplex',
        label:
          'Duplexación TDD para el perfil n78',
        status:
          tddPass
            ? 'PASS'
            : 'FAIL',
        severity: 'CRITICAL',
        observedValue:
          scenario.technology
            .duplexMode,
        requiredValue:
          'TDD',
        explanation: tddPass
          ? 'El escenario está configurado con TDD. Esto quiere decir que transmisión y recepción utilizan la misma banda de frecuencia, pero se separan en distintos instantes de tiempo. Esta configuración coincide con el modo de duplexación del perfil n78 y también con la condición TDD que MinTIC establece para los asignatarios a los que aplica la regulación de la banda de 3500 MHz. Por eso este criterio técnico pasa. Esto no significa que todo el despliegue ya cumpla la regulación colombiana ni que exista autorización para usar el espectro.'
          : 'El escenario no está configurado con TDD. Como el perfil n78 que evaluamos utiliza este modo de duplexación, la configuración no coincide con el criterio técnico seleccionado. En el contexto colombiano que documentamos, la regulación consultada para la banda de 3500 MHz también establece TDD para los asignatarios a los que aplica.',
        remediation:
          tddPass
            ? undefined
            : 'Configurar el escenario con TDD si queremos evaluarlo como n78 dentro del perfil técnico y regulatorio documentado.',
        source: {
          sourceId:
            'ETSI_TS_138_101_1_V18_7_0',
          sourceType:
            'STANDARD',
          verifiedAt:
            '2026-09-16',
        },
      },
      {
        id:
          'n78-bandwidth-scs30',
        label:
          'Ancho de banda para n78 con SCS de 30 kHz',
        status:
          bandwidthPass
            ? 'PASS'
            : 'FAIL',
        severity: 'CRITICAL',
        observedValue:
          bandwidthMhz,
        requiredValue:
          '10, 15, 20, 25, 30, 40, 50, 60, 70, 80, 90 o 100',
        unit: 'MHz',
        explanation:
          bandwidthPass
            ? `El ancho de banda configurado es de ${Number(bandwidthMhz.toFixed(3))} MHz y aparece entre las combinaciones que admite el perfil n78 con SCS de 30 kHz que usamos como referencia. Por eso, para esta combinación concreta de banda, separación entre subportadoras y ancho de canal, el criterio técnico pasa.`
            : `El ancho de banda configurado es de ${Number(bandwidthMhz.toFixed(3))} MHz y no aparece entre los valores que admite el perfil n78 con SCS de 30 kHz que estamos evaluando. Por eso este criterio falla aunque otros resultados físicos del enlace sean favorables.`,
        remediation:
          bandwidthPass
            ? undefined
            : 'Seleccionar uno de los anchos de banda admitidos por el perfil n78 con SCS de 30 kHz o cambiar el perfil técnico que queremos evaluar.',
        relatedVariables: [
          'bandwidthHz',
        ],
        source: {
          sourceId:
            'ETSI_TS_138_101_1_V18_7_0',
          sourceType:
            'STANDARD',
          verifiedAt:
            '2026-09-16',
        },
      },

      evaluateRadioLink(
        scenario,
        results,
      ),

      {
        id: 'snr-information',
        label:
          'Relación señal/ruido (SNR)',
        status: 'CONDITIONAL',
        severity: 'INFO',
        observedValue:
          results.snrDb,
        unit: 'dB',
        explanation:
          'El SNR indica cuánto sobresale la señal recibida frente al ruido que calculamos. Un valor mayor suele representar mejores condiciones del enlace. En esta fase lo mostramos como información física y no lo convertimos automáticamente en CQI, MCS o modulación, porque esas decisiones requieren más variables que un único umbral de SNR.',
        source: {
          sourceId:
            'RADIO_ENGINE_CALCULATION',
          sourceType:
            'CALCULATION',
        },
      },
      {
        id:
          'shannon-information',
        label:
          'Capacidad teórica de Shannon',
        status: 'CONDITIONAL',
        severity: 'INFO',
        observedValue:
          results
            .shannonCapacityBps
          / 1e6,
        unit: 'Mbit/s',
        explanation:
          'La capacidad de Shannon nos sirve como límite teórico de cuánto podría transportar el canal bajo las condiciones de ancho de banda y SNR calculadas. No la interpretamos como la velocidad real de una red 5G, porque una implementación real también tiene codificación, señalización, planificación de recursos, retransmisiones y otras pérdidas.',
        source: {
          sourceId:
            'SHANNON_1948',
          sourceType:
            'STANDARD',
        },
      },
    ];

  return {
    profile: '5G_NR',
    label:
      'Perfil 5G NR n78',
    aggregateStatus:
      aggregate(criteria),
    criteria,
    blockers:
      blockers(criteria),
    results,
  };
}

export function evaluateImt2030(
  scenario: AssessmentScenario,
  results: LinkBudgetResult,
): ProfileAssessment {
  const capacityMbps =
    results.shannonCapacityBps
    / 1e6;

  const belowIllustrativeTarget =
    capacityMbps
    < IMT2030_ILLUSTRATIVE_USER_RATE_MBPS;

  const criteria:
    AssessmentCriterionResult[] = [
      evaluateRadioLink(
        scenario,
        results,
      ),
      {
        id:
          'imt2030-frequency',
        label:
          'Frecuencia en el escenario IMT-2030',
        status:
          'NOT_EVALUABLE',
        severity: 'INFO',
        observedValue:
          scenario.radio
            .frequencyHz
          / 1e6,
        unit: 'MHz',
        explanation:
          'Para IMT-2030 no tratamos la frecuencia como si ya existiera una banda final equivalente a n78. El marco ITU-R M.2160 define capacidades y objetivos generales, pero no nos permite declarar que esta frecuencia sea una banda comercial 6G definitiva. Por eso dejamos este punto como no evaluable en lugar de inventar una regla.',
        source: {
          sourceId:
            'ITU_R_M_2160_0_2023',
          sourceType:
            'STANDARD',
          verifiedAt:
            '2026-09-16',
        },
      },
      {
        id:
          'imt2030-capacity-screening',
        label:
          'Comparación experimental de capacidad con IMT-2030',
        status:
          belowIllustrativeTarget
            ? 'FAIL'
            : 'CONDITIONAL',
        severity: 'CRITICAL',
        observedValue:
          capacityMbps,
        requiredValue:
          '>= 300 como referencia ilustrativa, no como requisito final',
        unit: 'Mbit/s',
        explanation:
          belowIllustrativeTarget
            ? 'Incluso el límite teórico de Shannon que obtenemos para este escenario queda por debajo de la referencia ilustrativa de 300 Mbit/s que usamos a partir de ITU-R M.2160 para la tasa de datos experimentada por el usuario. En términos prácticos, si ni siquiera el límite teórico alcanza esa referencia, este escenario no podría hacerlo bajo este modelo.'
            : 'El límite teórico de Shannon supera la referencia ilustrativa de 300 Mbit/s. Esto solo nos permite decir que el límite matemático no descarta esa referencia; no demuestra que un usuario real vaya a recibir esa velocidad ni que el escenario cumpla IMT-2030. Por eso el resultado queda como condicional.',
        remediation:
          belowIllustrativeTarget
            ? 'Podemos revisar ancho de banda, SNR y condiciones del enlace y, después, contrastar el escenario con métricas de desempeño más cercanas a una implementación real.'
            : undefined,
        relatedVariables: [
          'bandwidthHz',
          'snrDb',
          'receivedPowerDbm',
          'noisePowerDbm',
        ],
        source: {
          sourceId:
            'ITU_R_M_2160_0_2023',
          sourceType:
            'STANDARD',
          verifiedAt:
            '2026-09-16',
        },
      },
      {
        id:
          'imt2030-final-compliance',
        label:
          'Conclusión de cumplimiento IMT-2030',
        status:
          'NOT_EVALUABLE',
        severity: 'INFO',
        explanation:
          'Con esta herramienta no declaramos que un escenario tenga certificación o cumplimiento final de una interfaz radio 6G. Lo que hacemos es una evaluación experimental basada en referencias publicadas de IMT-2030 y dejamos explícitas las partes que todavía no se pueden concluir.',
        source: {
          sourceId:
            'ITU_IMT2030_WP5D_2026',
          sourceType:
            'STANDARD',
          verifiedAt:
            '2026-09-16',
        },
      },
    ];

  return {
    profile:
      'IMT2030_EXPERIMENTAL',
    label:
      'IMT-2030 experimental',
    aggregateStatus:
      aggregate(criteria),
    criteria,
    blockers:
      blockers(criteria),
    results,
  };
}
