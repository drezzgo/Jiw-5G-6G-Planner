import type {
  PropagationInput,
  PropagationResult,
} from './types';

const C_3GPP_M_PER_S = 3.0e8;

function assertFinitePositive(
  value: number,
  label: string,
): void {
  if (!Number.isFinite(value) || value <= 0) {
    throw new Error(
      `${label} debe ser un número finito mayor que cero.`,
    );
  }
}

function distance3D(
  distance2DM: number,
  bsHeightM: number,
  utHeightM: number,
): number {
  return Math.sqrt(
    distance2DM ** 2
    + (bsHeightM - utHeightM) ** 2,
  );
}

function commonFrequencyMessages(
  frequencyGHz: number,
): string[] {
  if (
    frequencyGHz <= 0.5
    || frequencyGHz >= 100
  ) {
    return [
      'La frecuencia queda fuera del dominio 0,5 < fc < 100 GHz usado por estos modelos.',
    ];
  }

  return [];
}

function calculateUmi(
  input: PropagationInput,
): PropagationResult {
  const bsHeightM = 10;
  const utHeightM = 1.5;
  const environmentHeightM = 1;

  const frequencyGHz =
    input.frequencyHz / 1e9;

  const d3D = distance3D(
    input.distance2DM,
    bsHeightM,
    utHeightM,
  );

  const effectiveBsHeightM =
    bsHeightM - environmentHeightM;

  const effectiveUtHeightM =
    utHeightM - environmentHeightM;

  const breakpointDistanceM =
    (
      4
      * effectiveBsHeightM
      * effectiveUtHeightM
      * input.frequencyHz
    ) / C_3GPP_M_PER_S;

  const messages = [
    ...commonFrequencyMessages(
      frequencyGHz,
    ),
  ];

  if (
    input.distance2DM < 10
    || input.distance2DM > 5000
  ) {
    messages.push(
      'UMi se aplica aquí para 10 m ≤ d2D ≤ 5 km.',
    );
  }

  const isApplicable =
    messages.length === 0;

  const losBeforeBreakpoint =
    32.4
    + 21 * Math.log10(d3D)
    + 20 * Math.log10(frequencyGHz);

  const losAfterBreakpoint =
    32.4
    + 40 * Math.log10(d3D)
    + 20 * Math.log10(frequencyGHz)
    - 9.5
      * Math.log10(
        breakpointDistanceM ** 2
        + (bsHeightM - utHeightM) ** 2,
      );

  const losPathLossDb =
    input.distance2DM <= breakpointDistanceM
      ? losBeforeBreakpoint
      : losAfterBreakpoint;

  const nlosCandidateDb =
    35.3 * Math.log10(d3D)
    + 22.4
    + 21.3 * Math.log10(frequencyGHz)
    - 0.3 * (utHeightM - 1.5);

  const pathLossDb =
    input.condition === 'LOS'
      ? losPathLossDb
      : Math.max(
          losPathLossDb,
          nlosCandidateDb,
        );

  return {
    model: 'UMI_STREET_CANYON',
    condition: input.condition,
    isApplicable,
    pathLossDb:
      isApplicable
        ? pathLossDb
        : undefined,
    distance2DM: input.distance2DM,
    distance3DM: d3D,
    bsHeightM,
    utHeightM,
    breakpointDistanceM,
    formulaId:
      input.condition === 'LOS'
        ? '3GPP_UMI_LOS'
        : '3GPP_UMI_NLOS',
    sourceId: '3GPP_TR_38_901_R19_4_0',
    sourceLocator:
      'Cláusula 7.4.1 · Tabla 7.4.1-1 · páginas PDF 37–38',
    messages,
  };
}

function calculateUma(
  input: PropagationInput,
): PropagationResult {
  const bsHeightM = 25;
  const utHeightM = 1.5;

  // Para hUT < 13 m, la nota 1 lleva a hE = 1 m
  // con probabilidad 1. Con hUT = 1,5 m del perfil,
  // este caso es determinista.
  const environmentHeightM = 1;

  const frequencyGHz =
    input.frequencyHz / 1e9;

  const d3D = distance3D(
    input.distance2DM,
    bsHeightM,
    utHeightM,
  );

  const effectiveBsHeightM =
    bsHeightM - environmentHeightM;

  const effectiveUtHeightM =
    utHeightM - environmentHeightM;

  const breakpointDistanceM =
    (
      4
      * effectiveBsHeightM
      * effectiveUtHeightM
      * input.frequencyHz
    ) / C_3GPP_M_PER_S;

  const messages = [
    ...commonFrequencyMessages(
      frequencyGHz,
    ),
  ];

  if (
    input.distance2DM < 10
    || input.distance2DM > 5000
  ) {
    messages.push(
      'UMa se aplica aquí para 10 m ≤ d2D ≤ 5 km.',
    );
  }

  const isApplicable =
    messages.length === 0;

  const losBeforeBreakpoint =
    28
    + 22 * Math.log10(d3D)
    + 20 * Math.log10(frequencyGHz);

  const losAfterBreakpoint =
    28
    + 40 * Math.log10(d3D)
    + 20 * Math.log10(frequencyGHz)
    - 9
      * Math.log10(
        breakpointDistanceM ** 2
        + (bsHeightM - utHeightM) ** 2,
      );

  const losPathLossDb =
    input.distance2DM <= breakpointDistanceM
      ? losBeforeBreakpoint
      : losAfterBreakpoint;

  const nlosCandidateDb =
    13.54
    + 39.08 * Math.log10(d3D)
    + 20 * Math.log10(frequencyGHz)
    - 0.6 * (utHeightM - 1.5);

  const pathLossDb =
    input.condition === 'LOS'
      ? losPathLossDb
      : Math.max(
          losPathLossDb,
          nlosCandidateDb,
        );

  return {
    model: 'UMA',
    condition: input.condition,
    isApplicable,
    pathLossDb:
      isApplicable
        ? pathLossDb
        : undefined,
    distance2DM: input.distance2DM,
    distance3DM: d3D,
    bsHeightM,
    utHeightM,
    breakpointDistanceM,
    formulaId:
      input.condition === 'LOS'
        ? '3GPP_UMA_LOS'
        : '3GPP_UMA_NLOS',
    sourceId: '3GPP_TR_38_901_R19_4_0',
    sourceLocator:
      'Cláusula 7.4.1 · Tabla 7.4.1-1 · páginas PDF 37–38',
    messages,
  };
}

function calculateInh(
  input: PropagationInput,
): PropagationResult {
  const bsHeightM = 3;
  const utHeightM = 1;

  const frequencyGHz =
    input.frequencyHz / 1e9;

  const d3D = distance3D(
    input.distance2DM,
    bsHeightM,
    utHeightM,
  );

  const messages = [
    ...commonFrequencyMessages(
      frequencyGHz,
    ),
  ];

  if (
    d3D < 1
    || d3D > 150
  ) {
    messages.push(
      'InH-Office se aplica aquí para 1 m ≤ d3D ≤ 150 m.',
    );
  }

  const isApplicable =
    messages.length === 0;

  const losPathLossDb =
    32.4
    + 17.3 * Math.log10(d3D)
    + 20 * Math.log10(frequencyGHz);

  const nlosCandidateDb =
    38.3 * Math.log10(d3D)
    + 17.30
    + 24.9 * Math.log10(frequencyGHz);

  const pathLossDb =
    input.condition === 'LOS'
      ? losPathLossDb
      : Math.max(
          losPathLossDb,
          nlosCandidateDb,
        );

  return {
    model: 'INH_OFFICE',
    condition: input.condition,
    isApplicable,
    pathLossDb:
      isApplicable
        ? pathLossDb
        : undefined,
    distance2DM: input.distance2DM,
    distance3DM: d3D,
    bsHeightM,
    utHeightM,
    formulaId:
      input.condition === 'LOS'
        ? '3GPP_INH_LOS'
        : '3GPP_INH_NLOS',
    sourceId: '3GPP_TR_38_901_R19_4_0',
    sourceLocator:
      'Cláusula 7.4.1 · Tabla 7.4.1-1 · página PDF 37; alturas de escenario: Tabla 7.2-2 · página PDF 25',
    messages,
  };
}

export function calculate3gppPathLoss(
  input: PropagationInput,
): PropagationResult {
  assertFinitePositive(
    input.frequencyHz,
    'frequencyHz',
  );

  assertFinitePositive(
    input.distance2DM,
    'distance2DM',
  );

  switch (input.model) {
    case 'UMI_STREET_CANYON':
      return calculateUmi(input);

    case 'UMA':
      return calculateUma(input);

    case 'INH_OFFICE':
      return calculateInh(input);

    default: {
      const unreachable: never =
        input.model;

      throw new Error(
        `Modelo no soportado: ${unreachable}`,
      );
    }
  }
}
