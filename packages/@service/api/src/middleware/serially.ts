import { Middleware } from '../types';

export function serially(...middlewares: Middleware[]): Middleware {
  return async function (request, context) {
    for (const middleware of middlewares) {
      await middleware(request, context);
    }
  };
}
