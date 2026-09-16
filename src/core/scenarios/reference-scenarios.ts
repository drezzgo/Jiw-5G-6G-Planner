import type { AssessmentScenario } from '../assessment/types';

export interface ReferenceScenario {
  id:
    | 'N78_REFERENCE'
    | 'N78_DISTANCE_DEGRADED'
    | 'N78_OUT_OF_BAND';
  label: string;
  shortDescription: string;
  scenario: AssessmentScenario;
  changedFrom?: string;
  parameterNotice: string;
}

const base: AssessmentScenario = {
  technology: {
    bandId: 'n78',
    duplexMode: 'TDD',
    architecture: 'SA',
    scsKhz: 30,
  },
  radio: {
    frequencyHz: 3.5e9,
    distanceM: 200,
    txPowerDbm: 30,
    txGainDbi: 15,
    txLossDb: 2,
    rxGainDbi: 0,
    rxLossDb: 1,
    bandwidthHz: 100e6,
    temperatureK: 290,
    noiseFigureDb: 7,
    receiverSensitivityDbm: -90,
  },
};

export const referenceScenarios: ReferenceScenario[] = [
  {
    id: 'N78_REFERENCE',
    label: 'Referencia 5G n78',
    shortDescription:
      'Perfil académico n78 con condiciones RF favorables.',
    scenario: structuredClone(base),
    parameterNotice:
      'La banda, TDD y combinaciones de bandwidth/SCS se contrastan con 3GPP/ETSI. Potencia, ganancias, NF y sensibilidad son parámetros del escenario académico, no valores universales 5G.',
  },
  {
    id: 'N78_DISTANCE_DEGRADED',
    label: 'Mismo enlace — distancia degradada',
    shortDescription:
      'Conserva la configuración y aumenta únicamente la distancia.',
    changedFrom: 'N78_REFERENCE: distanceM 200 → 30000',
    scenario: {
      ...structuredClone(base),
      radio: {
        ...structuredClone(base.radio),
        distanceM: 30_000,
      },
    },
    parameterNotice:
      'Este caso deriva del escenario de referencia. Se cambia únicamente la distancia para observar la degradación del link budget.',
  },
  {
    id: 'N78_OUT_OF_BAND',
    label: 'Buena RF, frecuencia fuera de n78',
    shortDescription:
      'Mantiene distancia favorable pero configura 4100 MHz con el perfil n78.',
    changedFrom:
      'N78_REFERENCE: frequencyHz 3.5 GHz → 4.1 GHz',
    scenario: {
      ...structuredClone(base),
      radio: {
        ...structuredClone(base.radio),
        frequencyHz: 4.1e9,
      },
    },
    parameterNotice:
      'Demuestra que un enlace con métricas RF favorables puede seguir siendo incompatible con el perfil tecnológico n78.',
  },
];

export function getReferenceScenario(
  id: ReferenceScenario['id'],
): ReferenceScenario {
  const found = referenceScenarios.find(
    (scenario) => scenario.id === id,
  );

  if (!found) {
    throw new Error(`Unknown reference scenario: ${id}`);
  }

  return structuredClone(found);
}
