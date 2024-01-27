import { dev } from '$app/environment';

function _assertNonEmptyString(value: unknown): string {
  if (typeof value !== 'string' || !value) {
    throw new Error();
  }

  return value;
}

function _assertInteger(value: unknown): number {
  if (typeof value !== 'string' || !/^[0-9]+$/.test(value)) {
    throw new Error();
  }

  return Number.parseInt(value);
}

export const assertNonEmptyString = dev ? _assertNonEmptyString : (value: unknown) => value as string;
export const assertInteger = dev ? _assertInteger : (value: unknown) => value as number;
