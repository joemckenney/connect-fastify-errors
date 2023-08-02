import { FastifyInstance } from 'fastify';
import { SOCKET_NAMESPACES } from '@dopt/const';
import { Socket } from 'socket.io';
import { client } from '@blocks/client';
import { InternalError } from '@dopt/error';

type FormattedFlow = {
  id: number;
  flowSid: string;
  version: number;
  lastActivity: string;
  state: string;
};

export async function emitFlowsInternal(
  fastify: FastifyInstance,
  { userId }: { userId: number; environmentId: number; workspaceId: number },
  ...flow: string[]
) {
  const [flowSid, version] = flow;

  const socketIdsByFlowInternal =
    fastify.connsByEndUser.get(userId)?.socketIdsByFlowInternal;
  if (
    socketIdsByFlowInternal?.size &&
    socketIdsByFlowInternal.has(`${flowSid}_${version}`)
  ) {
    await emitFlowStateInternal(
      fastify,
      userId,
      flowSid,
      parseInt(version, 10)
    );
  }
}

export const watchFlowInternal = async function (
  fastify: FastifyInstance,
  { socket, userId }: { userId: number; socket: Socket },
  ...flow: string[]
) {
  const [flowSid, version] = flow;

  try {
    await client.getFlowWithBlocks({
      userId,
      flowSid,
      version: parseInt(version, 10),
    });
  } catch (err) {
    socket.emit('error', 'Invalid Flow or Version');
    fastify.log.error(err);
    throw err;
  }
  const socketIdsByFlowInternal =
    fastify.connsByEndUser.get(userId)?.socketIdsByFlowInternal;
  if (
    socketIdsByFlowInternal?.size &&
    socketIdsByFlowInternal.has(`${flowSid}_${version}`)
  ) {
    socketIdsByFlowInternal.get(`${flowSid}_${version}`)?.add(socket.id);
  } else {
    socketIdsByFlowInternal?.set(`${flowSid}_${version}`, new Set([socket.id]));
  }
};

async function emitFlowStateInternal(
  fastify: FastifyInstance,
  userId: number,
  flowSid: string,
  version: number
) {
  const socketIdsByFlowInternal =
    fastify.connsByEndUser.get(userId)?.socketIdsByFlowInternal;
  if (socketIdsByFlowInternal?.size) {
    const { flow, blocks } = await client.getFlowWithBlocks({
      userId,
      flowSid,
      version,
    });
    if (flow && blocks && blocks.length > 0) {
      let flowState = '';
      if (flow.finished) {
        flowState = 'Finished';
      } else if (flow.stopped) {
        flowState = 'Stopped';
      } else if (flow.started) {
        flowState = 'Started';
      }
      const blockLastEncountered = blocks
        .map((block) => block.lastEncountered)
        .sort()
        .reverse()[0];
      if (!blockLastEncountered) {
        throw new InternalError({
          internalErrorMessage: 'no date found in blocks',
        });
      }
      const flowUpdatedAt = flow.updatedAt;
      if (!flowUpdatedAt) {
        throw new InternalError({
          internalErrorMessage: 'no date found in flow',
        });
      }
      const lastActivity =
        blockLastEncountered > flowUpdatedAt
          ? blockLastEncountered
          : flowUpdatedAt;

      const formattedFlow: FormattedFlow = {
        id: flow.id,
        flowSid: flow.flowSid,
        version: flow.version,
        lastActivity: lastActivity.toDate().toString(),
        state: flowState,
      };
      for (const socketId of socketIdsByFlowInternal.get(
        `${flowSid}_${version}`
      ) || []) {
        fastify.io
          .of(SOCKET_NAMESPACES.V1_INTERNAL_CLIENT)
          .to(socketId)
          .emit('flowState', formattedFlow);
      }
    }
  }
}
