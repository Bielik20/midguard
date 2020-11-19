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
    type FooInputExt = {
      foo: string;
    };
    type FooOutput = {
      end: string;
    };
    type FooOutputExt = {
      foo: string;
    };
    function foo(): Middleware<FooInput, FooInputExt, FooOutput, FooOutputExt> {
      return (input, next) => {
        console.log('foo before');
        const output = next({ foo: 'foo' });
        console.log('foo after');

        // return { ...output, foo: 'foo' };
        return { foo: 'foo' };
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
    type BarOutputExt = {
      bar: string;
    };
    function bar(): Middleware<BarInput, BarInputExt, BarOutput, BarOutputExt> {
      return (input, next) => {
        console.log('bar before');
        const output = next({ bar: 'bar' });
        console.log('bar after');

        // return { ...output, bar: 'bar' };
        return { bar: 'bar' };
      };
    }

    // function noop(): Middleware<unknown, unknown> {
    //   return (input, next) => {
    //     const output = next({});
    //
    //     return { noop: 'noop' };
    //   };
    // }

    const handler: MiddlewareNext<FooInputExt, BarOutput> = (input) => {
      // console.log(input);
      // console.log(input.foo);
      console.log('handler');
      return { end: 'end' };
    };

    const okish = middleware(foo(), bar(), handler);
    const result = okish({ start: 'start' });

    console.log('result', result);

    // const combinedFooBar = middleware(foo(), bar());
    // const combinedBarNoop = middleware(noop(), bar());
    // const fooImp = foo();
    // const barImp = bar();
    // const combinedFooBarImp = middleware(fooImp, barImp);
    // const okish = middleware(foo(), bar(), handler);
    // const notOkCall = middleware(foo(), bar(), handler)({ start: 'ss' });
    // const notOk = middleware(foo(), bar(), (input) => {
    //   console.log(input.foo);
    //   return { end: 'end' };
    // });
  });
});
