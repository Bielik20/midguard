import { Middleware, MiddlewareNext, middleware } from './middleware';

describe('Middleware', () => {
  it('should work for simple string', () => {
    const foo: Middleware<any, any, any, any> = (input, next) => {
      const output = next(input + 'Foo');

      return output + 'Foo';
    };
    const bar: Middleware<any, any, any, any> = (input, next) => {
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
    function foo(): Middleware<FooInput, FooInputAdd, FooOutput, FooOutputMod> {
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
    function bar(): Middleware<BarInput, BarInputAdd, BarOutput, BarOutputMod> {
      return (input, next) => {
        const output = next({ bar: 'bar' });

        return { ...output, bar: 'bar' };
      };
    }

    function noop(): Middleware<unknown, unknown> {
      return (input, next) => {
        const output = next({});

        return { noop: 'noop' };
      };
    }

    const handler: MiddlewareNext<FooInputAdd, BarOutput> = (input) => {
      console.log(input.foo);
      return { end: 'end' };
    };

    const combinedFooBar = middleware(foo(), bar());
    const combinedBarNoop = middleware(noop(), bar());
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
