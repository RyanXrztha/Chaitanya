/** A business rule was violated by the input. `field` lets the UI point at the cause. */
export class ValidationError extends Error {
  constructor(
    message: string,
    readonly field?: string,
  ) {
    super(message);
    this.name = "ValidationError";
  }
}

export class NotFoundError extends Error {
  constructor(entity: string, id: string | number) {
    super(`${entity} not found: ${id}`);
    this.name = "NotFoundError";
  }
}

// Name-based guards: robust when the same class is loaded in more than one bundle
// (e.g. server components and server actions), where `instanceof` can fail.
export function isNotFoundError(e: unknown): e is NotFoundError {
  return e instanceof Error && e.name === "NotFoundError";
}

export function isValidationError(e: unknown): e is ValidationError {
  return e instanceof Error && e.name === "ValidationError";
}
