import { Route } from '../types';
import { validate } from '../middleware/';
import { VendorTestRequest } from '@gateway/definition';
import { client } from '@downstream-analytics/client';

export const route: Route[] = [
  {
    middleware: [
      validate.request<VendorTestRequest>().with.zod((z) => ({
        vendor: z.enum(['SEGMENT', 'HEAP', 'AMPLITUDE', 'MIXPANEL']),
        writeKey: z.string(),
      })),
    ],
    method: 'vendorTest',
    implementation: {
      vendorTest: async (request) => {
        return await client.vendorTest(request);
      },
    },
  },
];
