import { Middleware, MiddlewareNext, middleware } from './middleware';

describe('Middleware', () => {
  it('should work for simple string', () => {
    const foo: Middleware<any, any, any, any> = (input, next) => {
      const output = next({ input: input.input + 'Foo' });

      return output + 'Foo';
    };
    const bar: Middleware<any, any, any, any> = (input, next) => {
      const output = next({ input: input.input + 'Bar' });

      return output + 'Bar';
    };

    const fooBar = middleware(foo, bar);

    const result = middleware(middleware(), fooBar, (input) => {
      expect(input).toEqual({ input: 'startFooBar' });

      return 'end';
    })({ input: 'start' });

    expect(result).toEqual('endBarFoo');
  });

  it('should work with typing', () => {
    type FooInput = {
      start: string;
    };
    type FooInputAdd = {
      foo: string;
    };
    type FooOutput = {
      end: string;
    };
    type FooOutputMod = {
      end: string;
      foo: string;
    };
    function foo<TIn extends FooInput>(): Middleware<TIn, FooInputAdd, FooOutput, FooOutputMod> {
      return (input, next) => {
        const output = next({ foo: 'foo' });

        return { ...output, foo: 'foo' };
      };
    }

    type BarInput = {
      start: string;
    };
    type BarInputAdd = {
      bar: string;
    };
    type BarOutput = {
      end: string;
    };
    type BarOutputMod = {
      end: string;
      bar: string;
    };
    function bar<TIn extends BarInput>(): Middleware<TIn, BarInputAdd, BarOutput, BarOutputMod> {
      return (input, next) => {
        const output = next({ bar: 'bar' });

        return { ...output, bar: 'bar' };
      };
    }

    function noop<TIn, TOut>(): Middleware<TIn, void, TOut> {
      return (input, next) => {
        const output = next();

        return output;
      };
    }

    const handler: MiddlewareNext<FooInputAdd, BarOutput> = (input) => {
      console.log(input);
      return { end: 'end' };
    };

    // Middleware<FooInput, FooInput & FooInputAdd & void & BarInputAdd, BarOutput, FooOutputMod>
    const combinedFooBar = middleware(foo(), bar());
    const combinedBarNoop = middleware(foo(), noop(), bar());
    const combinedBarNoop2 = middleware(noop(), foo(), bar());
    const combinedBarNoop3 = middleware(foo(), bar(), noop());
    const fooImp = foo();
    const barImp = bar();
    const combinedFooBarImp = middleware(fooImp, barImp);
    const okish = middleware(foo(), bar(), handler);
    const notOkCall = middleware(foo(), bar(), handler)({ start: 'ss' });
    const notOk = middleware(foo(), bar(), (input) => {
      console.log(input.foo);
      return { end: 'end' };
    });
  });
});

type A = { veryString: 'strict' };

type B = A extends undefined ? 'yes' : 'no';

type C = undefined & A;

type D = unknown & A;
