import { Route } from '../types';
import { validate, authorize } from '../middleware/';
import {
  CreateDownstreamDestinationRequest,
  DeleteDownstreamDestinationRequest,
  GetDownstreamDestinationRequest,
  GetDownstreamDestinationsRequest,
  UpdateDownstreamDestinationRequest,
} from '@gateway/definition';
import { client } from '@app/rpc-client';

import { z } from 'zod';
const StandardString = z.string().min(1).max(100);

export const route: Route[] = [
  {
    middleware: [
      validate.session,
      authorize.user.in.session.can.access.environment.in.request,
      validate.request<GetDownstreamDestinationRequest>().with.zod((z) => ({
        id: z.number(),
        environmentId: z.number(),
      })),
    ],
    method: 'getDownstreamDestination',
    implementation: {
      getDownstreamDestination: async (request) => {
        return client.getDownstreamDestination(request);
      },
    },
  },
  {
    middleware: [
      validate.session,
      authorize.user.in.session.can.access.environment.in.request,
      validate.request<GetDownstreamDestinationsRequest>().with.zod((z) => ({
        environmentId: z.number(),
      })),
    ],
    method: 'getDownstreamDestinations',
    implementation: {
      getDownstreamDestinations: async (request) => {
        return client.getDownstreamDestinations(request);
      },
    },
  },
  {
    middleware: [
      validate.session,
      authorize.user.in.session.can.access.environment.in.request,
      validate.request<UpdateDownstreamDestinationRequest>().with.zod((z) => ({
        id: z.number(),
        vendor: StandardString.optional().or(z.literal('')),
        url: z.string().optional().or(z.literal('')),
        name: StandardString.optional().or(z.literal('')),
        writeKey: StandardString.optional().or(z.literal('')),
        environmentId: z.number().optional(),
        disabled: z.boolean().default(false).optional(),
      })),
    ],
    method: 'updateDownstreamDestination',
    implementation: {
      updateDownstreamDestination: async (request) => {
        return client.updateDownstreamDestination(request);
      },
    },
  },
  {
    middleware: [
      validate.session,
      authorize.user.in.session.can.access.environment.in.request,
      validate.request<CreateDownstreamDestinationRequest>().with.zod((z) => ({
        vendor: StandardString,
        name: StandardString,
        environmentId: z.number(),
        disabled: z.boolean().default(false).optional(),
        url: z.string().optional().or(z.literal('')),
        writeKey: z.string().optional().or(z.literal('')),
      })),
    ],
    method: 'createDownstreamDestination',
    implementation: {
      createDownstreamDestination: async (request) => {
        return client.createDownstreamDestination(request);
      },
    },
  },
  {
    middleware: [
      validate.session,
      authorize.user.in.session.can.access.environment.in.request,
      validate.request<DeleteDownstreamDestinationRequest>().with.zod((z) => ({
        id: z.number(),
        environmentId: z.number(),
      })),
    ],
    method: 'deleteDownstreamDestination',
    implementation: {
      deleteDownstreamDestination: async (request) => {
        return client.deleteDownstreamDestination(request);
      },
    },
  },
];
