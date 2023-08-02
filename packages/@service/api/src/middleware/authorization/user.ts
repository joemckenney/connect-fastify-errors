import { Middleware } from '../../types';
import { Code, ConnectError } from '@bufbuild/connect';
import { client } from '@auth/client';
import { client as appClient } from '@app/rpc-client';
import { parseJwt } from '@dopt/auth-utils';
import { InternalService } from '@dopt/app-server-sdk';
import { BadRequestError } from '@dopt/error';
import { NoApiKeyError } from '@dopt/app-error';
import { EndUserNotFoundError } from '@dopt/user-error';
import { InternalService as InternalUserService } from '@dopt/user-service-sdk';
const { INTERNAL_API_KEY } = process.env;

const userInSessionCanAccessEnvironmentInRequest: Middleware = async (
  request,
  context
) => {
  if (!('environmentId' in request)) {
    throw new ConnectError('Invalid environment', Code.InvalidArgument);
  }
  const authHeader = context.requestHeader.get('authorization') || ' ';
  const sessionToken = authHeader?.split(' ')[1];
  const parsedToken = parseJwt(sessionToken);
  const { user } = await client.me({
    doptId: parsedToken.doptUserId,
    descopeId: parsedToken.sub,
    workspaceId: parsedToken.workspaceId,
  });
  if (!INTERNAL_API_KEY) {
    throw new ConnectError('Internal Key', Code.Internal);
  }

  // TODO replace with future @app/client
  const environment = await InternalService.getApiInternalEnvironment({
    id: request.environmentId,
    xApiKey: INTERNAL_API_KEY,
  });
  if (user && environment.workspaceId !== user.workspaceId) {
    throw new ConnectError('Invalid environment', Code.InvalidArgument);
  }
};

export const userInSessionCanAccessEndUserInRequest: Middleware = async (
  request,
  context
) => {
  if (!('userId' in request)) {
    throw new BadRequestError();
  }
  const authHeader = context.requestHeader.get('authorization') || ' ';
  const sessionToken = authHeader?.split(' ')[1];
  const parsedToken = parseJwt(sessionToken);
  const { user } = await client.me({
    doptId: parsedToken.doptUserId,
    descopeId: parsedToken.sub,
    workspaceId: parsedToken.workspaceId,
  });

  if (!INTERNAL_API_KEY) {
    throw new NoApiKeyError();
  }
  // TODO replace with future @user/client
  const endUser = await InternalUserService.getApiInternalUser({
    id: request.userId,
    xApiKey: INTERNAL_API_KEY,
  });
  if (
    !endUser ||
    !endUser.id ||
    !endUser.identifier ||
    !user ||
    endUser.workspaceId !== user.workspaceId
  ) {
    throw new EndUserNotFoundError();
  }
};

export const userInSessionCanAccessWorkspaceInHeader: Middleware = async (
  _,
  context
) => {
  const authHeader = context.requestHeader.get('authorization') || ' ';
  const sessionToken = authHeader?.split(' ')[1];
  const { doptUserId: userId } = parseJwt(sessionToken);

  userId as number;

  const workspaceIdString = context.requestHeader.get('workspaceId') || ' ';
  const workspaceId = parseInt(workspaceIdString, 10);

  const { value } = await appClient.isUserInWorkspace({
    userId,
    workspaceId,
  });

  if (!value) {
    throw new ConnectError(
      'User from session not in workspace from header',
      Code.NotFound
    );
  }
};

export const user = {
  in: {
    session: {
      can: {
        access: {
          endUser: {
            in: {
              request: userInSessionCanAccessEndUserInRequest,
            },
          },
          workspace: {
            in: {
              header: userInSessionCanAccessWorkspaceInHeader,
            },
          },
          environment: {
            in: {
              request: userInSessionCanAccessEnvironmentInRequest,
            },
          },
        },
      },
    },
  },
};
