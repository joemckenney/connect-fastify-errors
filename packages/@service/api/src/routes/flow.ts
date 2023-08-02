import { Route } from '../types';
import { validate } from '../middleware/';
import { client } from '@app/rpc-client';

import { GetFlowRequest } from '@gateway/definition';

export const route: Route[] = [
  {
    middleware: [
      validate.session,
      validate.request<GetFlowRequest>().with.zod((z) => ({
        flowId: z.number(),
      })),
    ],
    method: 'getFlow',
    implementation: {
      getFlow: async (request) => {
        return client.getFlow(request);
      },
    },
  },
];
