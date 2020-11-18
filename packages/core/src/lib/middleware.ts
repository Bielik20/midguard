import { noopMiddleware } from './utils';

export interface MiddlewareFunction<TIn, TInMod, TOut, TOutMod> {
  (input: TIn, next: MiddlewareNext<TInMod, TOut>): TOutMod;
}

export interface MiddlewareNext<TIn, TOut> {
  (input: TIn): TOut;
}

export function middleware<T1, T2>(): MiddlewareFunction<T1, T1, T2, T2>;

export function middleware<T1, T2>(fn1: MiddlewareNext<T1, T2>, ...fns: never[]): MiddlewareNext<T1, T2>;
export function middleware<T1, T2, T3, T4>(fn1: MiddlewareFunction<T1, T2, T3, T4>): MiddlewareFunction<T1, T2, T3, T4>;

export function middleware<T1, T2, T3, T4, T5>(
  fn1: MiddlewareFunction<T1, T2, T3, T4>,
  fn2: MiddlewareNext<T2, T5>,
  ...fns: never[]
): MiddlewareNext<T1, T4>;
export function middleware<T1, T2, T3, T4, T5, T6>(
  fn1: MiddlewareFunction<T1, T2, T3, T4>,
  fn2: MiddlewareFunction<T2, T5, T6, T3>,
): MiddlewareFunction<T1, T5, T6, T4>;

export function middleware<T1, T2, T3, T4, T5, T6, T7>(
  fn1: MiddlewareFunction<T1, T2, T3, T4>,
  fn2: MiddlewareFunction<T2, T5, T6, T3>,
  fn3: MiddlewareNext<T5, T7>,
  ...fns: never[]
): MiddlewareNext<T1, T4>;
export function middleware<T1, T2, T3, T4, T5, T6, T7, T8>(
  fn1: MiddlewareFunction<T1, T2, T3, T4>,
  fn2: MiddlewareFunction<T2, T5, T6, T3>,
  fn3: MiddlewareFunction<T5, T7, T8, T6>,
): MiddlewareFunction<T1, T7, T8, T4>;

export function middleware(
  ...fns: (MiddlewareFunction<any, any, any, any> | MiddlewareNext<any, any>)[]
): MiddlewareFunction<any, any, any, any> {
  return middlewareFromArray(fns);
}

function middlewareFromArray<TIn, TInMod, TOut, TOutMod>(
  fns: MiddlewareFunction<TIn, TInMod, TOut, TOutMod>[],
): MiddlewareFunction<TIn, TInMod, TOut, TOutMod> {
  if (fns.length === 0) {
    return noopMiddleware as MiddlewareFunction<any, any, any, any>;
  }

  if (fns.length === 1) {
    return fns[0];
  }

  return fns.reduceRight(
    (result: MiddlewareFunction<any, any, any, any>, fn: MiddlewareFunction<any, any, any, any>) => (input, next) =>
      fn(input, (nextInput) => result(nextInput, next)),
  );
}
