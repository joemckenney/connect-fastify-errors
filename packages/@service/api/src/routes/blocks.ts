import { Route } from '../types';
import { validate, authorize } from '../middleware';
import { client } from '@blocks/client';

export const route: Route = {
  middleware: [
    validate.session,
    authorize.user.in.session.can.access.endUser.in.request,
  ],
  method: 'listFlowsByUserId',
  implementation: {
    listFlowsByUserId: async (request) => {
      return await client.listFlowsByUserId(request);
    },
  },
};
