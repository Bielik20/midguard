import { MiddlewareFunction, MiddlewareNext, middleware } from './middleware';

describe('Middleware', () => {
  it('should work for simple string', () => {
    const foo: MiddlewareFunction<any, any, any, any> = (input, next) => {
      const output = next(input + 'Foo');

      return output + 'Foo';
    };
    const bar: MiddlewareFunction<any, any, any, any> = (input, next) => {
      const output = next(input + 'Bar');

      return output + 'Bar';
    };

    const fooBar = middleware(foo, bar);

    const result = middleware(middleware(), fooBar, (input) => {
      expect(input).toEqual('startFooBar');

      return 'end';
    })('start');

    expect(result).toEqual('endBarFoo');
  });

  it('should work with typing', () => {
    type FooInput = {
      start: string;
    };
    type FooInputMod = {
      foo: string;
    };
    type FooOutput = {
      end: string;
    };
    type FooOutputMod = {
      foo: string;
    };
    function foo<TInput extends FooInput, TOutput extends FooOutput>(): MiddlewareFunction<
      TInput,
      TInput & FooInputMod,
      TOutput,
      TOutput & FooOutputMod
    > {
      return (input, next) => {
        const output = next({ ...input, foo: 'foo' });

        return { ...output, foo: 'foo' };
      };
    }

    type BarInput = {
      start: string;
    };
    type BarInputMod = {
      bar: string;
    };
    type BarOutput = {
      end: string;
    };
    type BarOutputMod = {
      bar: string;
    };
    function bar<TInput extends BarInput, TOutput extends BarOutput>(): MiddlewareFunction<
      TInput,
      TInput & BarInputMod,
      TOutput,
      TOutput & BarOutputMod
    > {
      return (input, next) => {
        const output = next({ ...input, bar: 'bar' });

        return { ...output, bar: 'bar' };
      };
    }

    const handler: MiddlewareNext<FooInputMod, BarOutput> = (input) => {
      console.log(input.foo);
      return { end: 'end' };
    };

    const combinedFooBar = middleware(foo(), bar());
    const fooImp = foo();
    const barImp = bar();
    const combinedFooBarImp = middleware(fooImp, barImp);
    const okish = middleware(foo(), bar(), handler);
    // const notOkCall = middleware(foo(), bar(), handler)({ start: 'ss' });
    // const notOk = middleware(foo(), bar(), (input) => {
    //   console.log(input.foo);
    //   return { end: 'end' };
    // });
  });
});
