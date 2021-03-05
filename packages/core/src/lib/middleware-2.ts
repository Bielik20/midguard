import { Middleware, MiddlewareNext } from './middleware';

type FooInput = {
  start: string;
};
type FooInputExt = {
  foo: string;
};
type FooOutput = {
  end: string;
};
type FooOutputMod = {
  end: string;
  foo: string;
};
function foo(): <TIn extends FooInput>(input: TIn, next: MiddlewareNext<TIn & FooInputExt, FooOutput>) => FooOutputMod {
  // function foo<TIn extends FooInput>(): Middleware<TIn, TIn & FooInputMod, FooOutput, FooOutputMod> {
  return (input, next) => {
    const output = next({ ...input, foo: 'foo' });

    return { ...output, foo: 'foo' };
  };
}

type BarInput = {
  start: string;
};
type BarInputExt = {
  bar: string;
};
type BarOutput = {
  end: string;
};
type BarOutputMod = {
  end: string;
  bar: string;
};
function bar(): <TIn extends BarInput>(input: TIn, next: MiddlewareNext<TIn & BarInputExt, BarOutput>) => BarOutputMod {
  // function bar<TIn extends BarInput>(): Middleware<TIn, TIn & BarInputExt, BarOutput, BarOutputMod> {
  return (input, next) => {
    const output = next({ ...input, bar: 'bar' });

    return { ...output, bar: 'bar' };
  };
}

const fooImpl = foo();
const barImpl = bar();
