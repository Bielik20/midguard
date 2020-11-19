import { noopMiddleware } from './utils';

export interface Middleware<TIn, TInExt, TOut = unknown, TOutMod = TOut> {
  (input: TIn, next: MiddlewareNext<TInExt, TOut>): TOutMod;
}

export interface MiddlewareNext<TIn, TOut> {
  (input: TIn): TOut;
}

export function middleware<T1, T2>(): Middleware<T1, T1, T2, T2>;

export function middleware<T1, T2>(fn1: MiddlewareNext<T1, T2>, ...fns: never[]): MiddlewareNext<T1, T2>;
export function middleware<T1, T2, T3, T4>(fn1: Middleware<T1, T2, T3, T4>): Middleware<T1, T2, T3, T4>;

export function middleware<T1, T2, T3, T4>(
  fn1: Middleware<T1, T2, T3, T4>,
  fn2: MiddlewareNext<T1 & T2, T3>,
  ...fns: never[]
): MiddlewareNext<T1, T4>;
export function middleware<T1, T2, T3, T4, T5, T6>(
  fn1: Middleware<T1, T2, T3, T4>,
  fn2: Middleware<T1 & T2, T5, T6, T3>,
): Middleware<T1, T1 & T2 & T5, T6, T4>;

export function middleware<T1, T2, T3, T4, T5, T6>(
  fn1: Middleware<T1, T2, T3, T4>,
  fn2: Middleware<T1 & T2, T5, T6, T3>,
  fn3: MiddlewareNext<T1 & T2 & T5, T6>,
  ...fns: never[]
): MiddlewareNext<T1, T4>;
export function middleware<T1, T2, T3, T4, T5, T6, T7, T8>(
  fn1: Middleware<T1, T2, T3, T4>,
  fn2: Middleware<T1 & T2, T5, T6, T3>,
  fn3: Middleware<T1 & T2 & T5, T7, T8, T6>,
): Middleware<T1, T1 & T2 & T5 & T7, T8, T4>;

export function middleware(
  ...fns: (Middleware<any, any, any, any> | MiddlewareNext<any, any>)[]
): Middleware<any, any, any, any> {
  return middlewareFromArray(fns);
}

function middlewareFromArray<TIn, TInMod, TOut, TOutMod>(
  fns: Middleware<TIn, TInMod, TOut, TOutMod>[],
): Middleware<TIn, TInMod, TOut, TOutMod> {
  if (fns.length === 0) {
    return noopMiddleware as Middleware<any, any, any, any>;
  }

  if (fns.length === 1) {
    return fns[0]; // TODO?
  }

  return fns.reduceRight(
    (result: Middleware<any, any, any, any>, fn: Middleware<any, any, any, any>) => (input, next) =>
      fn(input, (nextInput) => result({ ...input, ...nextInput }, next)),
  );
}
