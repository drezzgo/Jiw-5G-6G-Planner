import {
  calculateShannonCapacityBps,
} from '../radio';

import type {
  Imt2030ExperimentInput,
  Imt2030ExperimentResult,
} from './types';

const LOWER_USER_RATE_EXAMPLE_BPS =
  300e6;

const UPPER_USER_RATE_EXAMPLE_BPS =
  500e6;

function assertInput(
  input: Imt2030ExperimentInput,
): void {
  if (
    !Number.isFinite(
      input.bandwidthHz,
    )
    || input.bandwidthHz <= 0
  ) {
    throw new Error(
      'bandwidthHz debe ser mayor que cero.',
    );
  }

  if (
    !Number.isFinite(
      input.snrDb,
    )
  ) {
    throw new Error(
      'snrDb debe ser un número finito.',
    );
  }
}

export function evaluateImt2030Experiment(
  input: Imt2030ExperimentInput,
): Imt2030ExperimentResult {
  assertInput(input);

  const theoreticalCapacityBps =
    calculateShannonCapacityBps(
      input.bandwidthHz,
      input.snrDb,
    );

  const theoreticalSpectralEfficiencyBpsHz =
    theoreticalCapacityBps
    / input.bandwidthHz;

  let userRateScreening:
    Imt2030ExperimentResult[
      'userRateScreening'
    ];

  let interpretation: string;

  if (
    theoreticalCapacityBps
    < LOWER_USER_RATE_EXAMPLE_BPS
  ) {
    userRateScreening =
      'BELOW_300';

    interpretation =
      'Shannon queda por debajo de 300 Mbit/s; con estos parámetros esa referencia no es alcanzable ni teóricamente.';
  } else if (
    theoreticalCapacityBps
    < UPPER_USER_RATE_EXAMPLE_BPS
  ) {
    userRateScreening =
      'BETWEEN_300_500';

    interpretation =
      'Shannon supera 300 Mbit/s, pero no 500 Mbit/s. La primera referencia es posible en el límite matemático, no una velocidad real garantizada.';
  } else {
    userRateScreening =
      'AT_OR_ABOVE_500';

    interpretation =
      'Shannon supera 500 Mbit/s. Es un límite teórico y no representa la velocidad real del usuario.';
  }

  return {
    bandwidthHz:
      input.bandwidthHz,
    snrDb:
      input.snrDb,

    theoreticalCapacityBps,
    theoreticalSpectralEfficiencyBpsHz,

    userRateScreening,
    interpretation,

    capabilities: [
      {
        id:
          'user-experienced-data-rate',
        title:
          'Tasa de datos del usuario',
        reference:
          '300 y 500 Mbit/s',
        status:
          'PARTIAL',
        explanation:
          'Solo podemos descartar una referencia cuando el límite de Shannon queda por debajo.',
      },
      {
        id:
          'peak-data-rate',
        title:
          'Tasa de datos pico',
        reference:
          '50, 100 y 200 Gbit/s',
        status:
          'NOT_EVALUABLE',
        explanation:
          'El modelo no representa el sistema radio completo necesario para calcular una tasa pico.',
      },
      {
        id:
          'latency',
        title:
          'Latencia de interfaz radio',
        reference:
          '0,1–1 ms',
        status:
          'NOT_EVALUABLE',
        explanation:
          'No modelamos tramas, colas ni retransmisiones.',
      },
      {
        id:
          'mobility',
        title:
          'Movilidad',
        reference:
          '500–1.000 km/h',
        status:
          'NOT_EVALUABLE',
        explanation:
          'No simulamos el comportamiento del enlace mientras el usuario se mueve.',
      },
      {
        id:
          'positioning',
        title:
          'Posicionamiento',
        reference:
          '1–10 cm',
        status:
          'NOT_EVALUABLE',
        explanation:
          'Las coordenadas del mapa no miden precisión de posicionamiento.',
      },
      {
        id:
          'security-ai-sensing',
        title:
          'Seguridad, IA y sensado',
        reference:
          'Capacidades adicionales',
        status:
          'NOT_EVALUABLE',
        explanation:
          'Requieren modelos distintos al presupuesto de enlace.',
      },
    ],
  };
}
