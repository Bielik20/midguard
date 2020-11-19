import { noopMiddleware } from './utils';

export interface Middleware<TIn, TInExt, TOut, TOutMod = TOut> {
  (input: TIn, next: MiddlewareNext<TInExt, TOut>): TOutMod;
}

export interface MiddlewareNext<TIn, TOut> {
  (input: TIn): TOut;
}

type ReplaceVoid<T> = T extends void ? unknown : T;

// 0 ############################

export function middleware<FnIn, FnOut>(): Middleware<FnIn, FnIn, FnOut, FnOut>;

// 1 ############################

export function middleware<FnIn, FnOut>(fn: MiddlewareNext<FnIn, FnOut>, ...fns: never[]): MiddlewareNext<FnIn, FnOut>;
export function middleware<FnIn, FnExt, FnOut, FnOutMod>(
  fn: Middleware<FnIn, FnExt, FnOut, FnOutMod>,
): Middleware<FnIn, FnExt, FnOut, FnOutMod>;

// 2 ############################

export function middleware<
  Fn1In,
  Fn1Ext,
  Fn1Out extends Fn2Out,
  Fn1OutMod,
  Fn2In extends Fn1In & ReplaceVoid<Fn1Ext>,
  Fn2Out,
  FnRIn extends Fn1In,
  FnROut extends Fn1OutMod
>(
  fn1: Middleware<Fn1In, Fn1Ext, Fn1Out, Fn1OutMod>,
  fn3: MiddlewareNext<Fn2In, Fn2Out>,
  ...fns: never[]
): MiddlewareNext<FnRIn, FnROut>;
export function middleware<
  Fn1In,
  Fn1Ext,
  Fn1Out extends Fn2OutMod,
  Fn1OutMod,
  Fn2In extends Fn1In & ReplaceVoid<Fn1Ext>,
  Fn2Ext,
  Fn2Out,
  Fn2OutMod,
  FnRIn extends Fn1In,
  FnRExt extends Fn2In & ReplaceVoid<Fn2Ext>,
  FnROut extends Fn2Out,
  FnROutMod extends Fn1OutMod
>(
  fn1: Middleware<Fn1In, Fn1Ext, Fn1Out, Fn1OutMod>,
  fn2: Middleware<Fn2In, Fn2Ext, Fn2Out, Fn2OutMod>,
): Middleware<FnRIn, FnRExt, FnROut, FnROutMod>;

// 3 ############################

export function middleware<
  Fn1In,
  Fn1Ext,
  Fn1Out extends Fn2OutMod,
  Fn1OutMod,
  Fn2In extends Fn1In & ReplaceVoid<Fn1Ext>,
  Fn2Ext,
  Fn2Out extends Fn3Out,
  Fn2OutMod,
  Fn3In extends Fn2In & ReplaceVoid<Fn2Ext>,
  Fn3Out,
  FnRIn extends Fn1In,
  FnROut extends Fn1OutMod
>(
  fn1: Middleware<Fn1In, Fn1Ext, Fn1Out, Fn1OutMod>,
  fn2: Middleware<Fn2In, Fn2Ext, Fn2Out, Fn2OutMod>,
  fn3: MiddlewareNext<Fn3In, Fn3Out>,
  ...fns: never[]
): MiddlewareNext<FnRIn, FnROut>;
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

// Implementation ############################

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
    return fns[0];
  }

  return fns.reduceRight(
    (result: Middleware<any, any, any, any>, fn: Middleware<any, any, any, any>) => (input, next) =>
      fn(input, (nextInput) => result({ ...input, ...nextInput }, next)),
  );
}
