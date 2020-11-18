export const noopMiddleware = <TIn, TOut>(input: TIn, next: (nextInput: TIn) => TOut) => next(input);

export function noopNext<T>(input: T): T {
  return input;
}
