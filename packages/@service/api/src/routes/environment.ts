import { Route } from '../types';
import { validate } from '../middleware/';
import { client } from '@app/rpc-client';
import { GetEnvironmentRequest } from '@gateway/definition';

export const route: Route[] = [
  {
    middleware: [
      validate.session,
      validate.request<GetEnvironmentRequest>().with.zod((z) => ({
        environmentId: z.number(),
      })),
    ],
    method: 'getEnvironment',
    implementation: {
      getEnvironment: async (request) => {
        return client.getEnvironment(request);
      },
    },
  },
];
