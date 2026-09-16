/// <reference lib="webworker" />

import {
  generateCoverageGrid,
  type CoverageInput,
} from '../core/coverage';

interface CoverageWorkerRequest {
  requestId: number;
  input: CoverageInput;
}

self.onmessage = (
  event: MessageEvent<CoverageWorkerRequest>,
) => {
  const {
    requestId,
    input,
  } = event.data;

  try {
    const result =
      generateCoverageGrid(input);

    self.postMessage({
      requestId,
      result,
    });
  } catch (error) {
    self.postMessage({
      requestId,
      error:
        error instanceof Error
          ? error.message
          : 'No fue posible calcular la cobertura.',
    });
  }
};

export {};
