import { Route } from '../types';
import { validate } from '../middleware/';
import { client } from '@app/rpc-client';

import { GetBlockRequest } from '@gateway/definition';

export const route: Route[] = [
  {
    middleware: [
      validate.session,
      validate.request<GetBlockRequest>().with.zod((z) => ({
        blockUuid: z.string(),
        blockVersion: z.number(),
      })),
    ],
    method: 'getBlock',
    implementation: {
      getBlock: async (request) => {
        return client.getBlock(request);
      },
    },
  },
];
