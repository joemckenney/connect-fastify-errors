import { Route } from '../types';
import { validate } from '../middleware/';

import { Timestamp } from '@event-logs/client';

import { client as eventLogsClient } from '@event-logs/client';
import { GetFlowMetricsRequest } from '@gateway/definition';

export const route: Route = {
  middleware: [
    validate.session,
    validate.request<GetFlowMetricsRequest>().with.zod((z) => ({
      flow: z
        .number()
        .int()
        .refine((id) => id, { message: 'Flow is required' }),
      environment: z
        .number()
        .int()
        .refine((id) => id, { message: 'Environment is required' }),
      pageSize: z.number().int(),
      pageToken: z.string(),
      timestampStart: z.instanceof(Timestamp).optional(),
      timestampEnd: z.instanceof(Timestamp).optional(),
    })),
  ],
  method: 'getFlowMetrics',
  implementation: {
    getFlowMetrics: async (request) => {
      const result = await eventLogsClient.getGroupedFlowStateChange({
        ...request,
      });

      return {
        flowMetrics: result ? result.groupedFlowStateChange : [],
        nextPageToken: result?.nextPageToken,
      };
    },
  },
};
