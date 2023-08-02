import { BadRequestError, InternalError } from '@dopt/error';
import {
  emitFlowsInternal,
  watchFlowInternal,
} from '../../service/socket/flow';
import { disconnectClient } from '../../service/socket/user';
import { registerAsyncSocketListener } from '@dopt/service-fastify-plugins';
import {
  NO_AUTH_PROVIDED,
  NO_ENVIRONMENT_PROVIDED_ERROR,
  NO_USER_PROVIDED_ERROR,
  SOCKET_NAMESPACES,
} from '@dopt/const';
import { InternalService as InternalUserService } from '@dopt/user-service-sdk';
import { FastifyInstance } from 'fastify';
import { Socket } from 'socket.io';
import {
  parseJwt,
  sessionAuthChecker as sessionAuthCheckerHelper,
} from '@dopt/auth-utils';
import { client } from '@auth/client';

const { INTERNAL_API_KEY } = process.env;

async function validateSession(
  _fastify: FastifyInstance,
  authHeader: string | undefined,
  socket: Socket
): Promise<{
  id: number;
  workspaceId: number;
}> {
  if (!authHeader) {
    socket.emit('error', NO_AUTH_PROVIDED);
    socket.disconnect(true);
    throw new BadRequestError({
      internalErrorMessage: 'No auth header provided',
      externalErrorMessage: 'No auth header provided',
    });
  }
  const sessionToken = await sessionAuthCheckerHelper(authHeader);
  const parsedToken = parseJwt(sessionToken);

  const { user } = await client.me({
    doptId: parsedToken.doptUserId,
    descopeId: parsedToken.sub,
    workspaceId: parsedToken.workspaceId,
  });
  if (!user) {
    throw new InternalError({
      internalErrorMessage: 'User not found',
    });
  }
  return { id: user.id, workspaceId: user.workspaceId };
}

export async function registerEndUserInternal(
  fastify: FastifyInstance,
  socket: Socket
) {
  const endUserIdentifier = socket.handshake['query']['endUserIdentifier'];
  const environmentId = socket.handshake['query']['environmentId'];
  if (!endUserIdentifier || typeof endUserIdentifier !== 'string') {
    socket.emit('error', NO_USER_PROVIDED_ERROR);
    socket.disconnect(true);
    throw new BadRequestError();
  }
  if (!environmentId || typeof environmentId !== 'string') {
    socket.emit('error', NO_ENVIRONMENT_PROVIDED_ERROR);
    socket.disconnect(true);
    throw new BadRequestError();
  }
  const { workspaceId } = await validateSession(
    fastify,
    socket.handshake.headers.authorization,
    socket
  );

  const endUser = await InternalUserService.getUserByIdentifier({
    environmentIdEquals: parseInt(environmentId),
    identifierEquals: endUserIdentifier,
    xApiKey: INTERNAL_API_KEY ? INTERNAL_API_KEY : '',
  });

  if (!fastify.connsByEndUser.has(endUser.id)) {
    fastify.io.of(SOCKET_NAMESPACES.INTERNAL_FLOWS).on(
      `${endUser.id}`,
      registerAsyncSocketListener<
        {
          userId: number;
          environmentId: number;
          workspaceId: number;
        },
        string
      >(
        fastify,
        (params, ...args) => emitFlowsInternal(fastify, params, ...args),
        {
          userId: endUser.id,
          environmentId: endUser.environmentId,
          workspaceId: workspaceId,
        }
      )
    );
  }
  addEndUserToState(fastify, endUser.id, socket.id);

  socket.on(
    'watch:userFlowState',
    registerAsyncSocketListener<{ userId: number; socket: Socket }, string>(
      fastify,
      (params, ...args) => watchFlowInternal(fastify, params, ...args),
      {
        userId: endUser.id,
        socket,
      }
    )
  );
  socket.on('disconnect', disconnectClient(fastify, endUser.id, socket.id));
  socket.emit('ready');
}

function addEndUserToState(
  fastify: FastifyInstance,
  userId: number,
  socketId: string
) {
  if (fastify.connsByEndUser.has(userId)) {
    fastify.connsByEndUser.get(userId)?.socketIds.add(socketId);
  } else {
    fastify.connsByEndUser.set(userId, {
      socketIds: new Set([socketId]),
      socketIdsByFlowInternal: new Map(),
    });
  }
}
