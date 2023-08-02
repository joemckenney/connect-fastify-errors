import { SOCKET_NAMESPACES } from '@dopt/const';
import { FastifyInstance } from 'fastify';

export const disconnectClient = function (
  fastify: FastifyInstance,
  userId: number,
  socketId: string
) {
  return function () {
    const connsByEndUser = fastify.connsByEndUser.get(userId);
    if (!connsByEndUser) {
      return;
    }
    const { socketIds, socketIdsByFlowInternal } = connsByEndUser;
    socketIds.delete(socketId);

    for (const [flow, sockets] of socketIdsByFlowInternal.entries() || []) {
      sockets.delete(socketId);
      if (!sockets.size) {
        socketIdsByFlowInternal.delete(flow);
      }
    }
    if (!socketIds.size) {
      fastify.connsByEndUser.delete(userId);
      fastify.io
        .of(SOCKET_NAMESPACES.INTERNAL_FLOWS)
        .removeAllListeners(userId.toString());
      fastify.io
        .of(SOCKET_NAMESPACES.V1_INTERNAL_CLIENT)
        .removeAllListeners(userId.toString());
    }
  };
};
