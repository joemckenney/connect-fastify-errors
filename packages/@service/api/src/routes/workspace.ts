import { Route } from '../types';
import { validate } from '../middleware/';
import { client } from '@app/rpc-client';
import {
  CreateWorkspaceWithUserRequest,
  CreateWorkspaceWithUserResponse,
  GetWorkspaceRequest,
} from '@gateway/definition';
import { parseJwt } from '@dopt/auth-utils';
import { client as authClient } from '@auth/client';
import { STATUS } from '@dopt/const';

export const route: Route[] = [
  {
    middleware: [
      validate.session,
      validate.request<GetWorkspaceRequest>().with.zod((z) => ({
        workspaceId: z.number(),
      })),
    ],
    method: 'getWorkspace',
    implementation: {
      getWorkspace: async (request: GetWorkspaceRequest) => {
        return client.getWorkspace(request);
      },
    },
  },
  {
    middleware: [
      validate.session,
      validate.request<CreateWorkspaceWithUserRequest>().with.zod((z) => ({
        workspaceSid: z.string(),
      })),
    ],
    method: 'createWorkspaceWithUser',
    implementation: {
      createWorkspaceWithUser: async (
        request: CreateWorkspaceWithUserRequest,
        context
      ) => {
        const authHeader = context.requestHeader.get('authorization') || '';
        const token = parseJwt(authHeader);
        if (!token.doptUserId) {
          return new CreateWorkspaceWithUserResponse({
            status: {
              code: STATUS.FAILED_PRECONDITION,
              message: 'The Token does not contain Dopt user information',
            },
          });
        }
        return await authClient.createWorkspaceWithUser({
          workspaceSid: request.workspaceSid,
          userId: token.doptUserId,
        });
      },
    },
  },
];
