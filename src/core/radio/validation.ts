import { RadioModelError } from './errors';

export function assertFinite(
  value: number,
  label: string,
): void {
  if (!Number.isFinite(value)) {
    throw new RadioModelError(`${label} must be a finite number.`);
  }
}

export function assertPositive(
  value: number,
  label: string,
): void {
  assertFinite(value, label);

  if (value <= 0) {
    throw new RadioModelError(`${label} must be greater than zero.`);
  }
}

export function assertNonNegative(
  value: number,
  label: string,
): void {
  assertFinite(value, label);

  if (value < 0) {
    throw new RadioModelError(`${label} must be zero or greater.`);
  }
}
