import { Route } from '../types';
import { validate } from '../middleware/';
import { HealthCheckResponse_ServingStatus } from '@gateway/definition';

export const route: Route = {
  middleware: [validate.session],
  method: 'healthCheck',
  implementation: {
    healthCheck: async (_request, _context) => {
      return {
        status: HealthCheckResponse_ServingStatus.SERVING,
      };
    },
  },
};
