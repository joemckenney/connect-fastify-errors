import { registerEndUserInternal } from '../routes/socket/user';

import { FastifyPluginAsync } from 'fastify';

import fp from 'fastify-plugin';
import { SOCKET_NAMESPACES } from '@dopt/const';
import { registerAsyncConnectionListener } from '@dopt/service-fastify-plugins';

export const registerSocketRoutes: FastifyPluginAsync = fp(async (fastify) => {
  fastify.io.of(SOCKET_NAMESPACES.V1_INTERNAL_CLIENT).on(
    'connection',
    registerAsyncConnectionListener(fastify, (socket) =>
      registerEndUserInternal(fastify, socket)
    )
  );
});
