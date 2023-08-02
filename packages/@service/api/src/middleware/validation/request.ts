import { Middleware } from '../../types';
import { Code, ConnectError } from '@bufbuild/connect';
import { z, ZodError } from 'zod';

type PartialRecord<K extends keyof any, T> = {
  [k in K]?: T;
};

export function request<T>() {
  return {
    with: {
      zod: (
        fn: (zod: typeof z) => PartialRecord<keyof T, typeof z.object.arguments>
      ): Middleware => {
        const schema = fn(z);
        return async function (request) {
          try {
            z.object(schema).parse(request);
          } catch (e) {
            if (e instanceof ZodError) {
              throw new ConnectError(e.message, Code.InvalidArgument);
            }
            throw new ConnectError('Invalid Error', Code.InvalidArgument);
          }
        };
      },
    },
  };
}
