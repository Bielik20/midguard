import { noopMiddleware } from './utils';

export interface Middleware<TIn, TInExt, TOut, TOutMod = TOut> {
  (input: TIn, next: MiddlewareNext<TInExt, TOut>): TOutMod;
}

export interface MiddlewareNext<TIn, TOut> {
  (input: TIn): TOut;
}

type ReplaceVoid<T> = T extends void ? unknown : T;

export function middleware<T1, T2>(): Middleware<T1, T1, T2, T2>;

export function middleware<T1, T2>(fn1: MiddlewareNext<T1, T2>, ...fns: never[]): MiddlewareNext<T1, T2>;
export function middleware<T1, T2, T3, T4>(fn1: Middleware<T1, T2, T3, T4>): Middleware<T1, T2, T3, T4>;

export function middleware<T1, T2, T3, T4>(
  fn1: Middleware<T1, T2, T3, T4>,
  fn2: MiddlewareNext<T1 & T2, T3>,
  ...fns: never[]
): MiddlewareNext<T1, T4 extends void ? T3 : T4>;
export function middleware<T1, T2, T3, T4, T5, T6>(
  fn1: Middleware<T1, T2, T3, T4>,
  fn2: Middleware<T1 & T2, T5, T6, T3>,
): Middleware<T1, T1 & T2 & T5, T6, T4 extends void ? (T3 extends void ? T6 : T3) : T4>;

export function middleware<T1, T2, T3, T4, T5, T6>(
  fn1: Middleware<T1, T2, T3, T4>,
  fn2: Middleware<T1 & T2, T5, T6, T3>,
  fn3: MiddlewareNext<T1 & T2 & T5, T6>,
  ...fns: never[]
): MiddlewareNext<T1, T4>;
// export function middleware<T1, T2, T3, T4, T5, T6, T7, T8>(
//   fn1: Middleware<T1, T2, T3, T4>,
//   fn2: Middleware<T1 & ReplaceVoid<T2>, T5, T6, T3>,
//   fn3: Middleware<ReplaceVoid<T1> & ReplaceVoid<T2> & ReplaceVoid<T5>, T7, T8, T6>,
// ): Middleware<T1, ReplaceVoid<T1> & ReplaceVoid<T2> & ReplaceVoid<T5> & ReplaceVoid<T7>, T8, T4>;
// export function middleware<T1, T2, T3, T4, T5 extends T1 & T2, T6, T7, T8, T9 extends T5 & T6, T10, T11, T12>(
//   fn1: Middleware<T1, T2, T3, T4>,
//   fn2: Middleware<T5, T6, T7, T8>,
//   fn3: Middleware<T9, T10, T11, T12>,
// ): Middleware<T1, T9 & T10, T8, T4>;
export function middleware<
  Fn1In,
  Fn1Ext,
  Fn1Out extends Fn2OutMod,
  Fn1OutMod,
  Fn2In extends Fn1In & ReplaceVoid<Fn1Ext>,
  Fn2Ext,
  Fn2Out extends Fn3OutMod,
  Fn2OutMod,
  Fn3In extends Fn2In & ReplaceVoid<Fn2Ext>,
  Fn3Ext,
  Fn3Out,
  Fn3OutMod,
  FnRIn extends Fn1In,
  FnRExt extends Fn3In & ReplaceVoid<Fn3Ext>,
  FnROut extends Fn3Out,
  FnROutMod extends Fn1OutMod
>(
  fn1: Middleware<Fn1In, Fn1Ext, Fn1Out, Fn1OutMod>,
  fn2: Middleware<Fn2In, Fn2Ext, Fn2Out, Fn2OutMod>,
  fn3: Middleware<Fn3In, Fn3Ext, Fn3Out, Fn3OutMod>,
): Middleware<FnRIn, FnRExt, FnROut, FnROutMod>;

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
