import { Route } from '../types';
import { validate } from '../middleware';
import { client } from '@auth/client';
import { parseJwt } from '@dopt/auth-utils';
import {
  SignInOrUpResponse,
  UpdateUserStatusResponse,
} from '@gateway/definition';
import { REFRESH_COOKIE } from '../const/session';
import { parseCookieHeader } from '../utils/cookie';
import { STATUS } from '@dopt/const';

export const route: Route[] = [
  {
    middleware: [validate.session],
    method: 'me',
    implementation: {
      me: async (request, context) => {
        const authHeader = context.requestHeader.get('authorization') || '';
        const token = parseJwt(authHeader);
        return await client.me({
          doptId: token.doptUserId,
          descopeId: token.sub,
          workspaceId: request.workspaceId,
        });
      },
    },
  },
  {
    middleware: [validate.cookie],
    method: 'signInOrUp',
    implementation: {
      signInOrUp: async (request, context) => {
        const cookies = parseCookieHeader(context.requestHeader.get('cookie'));
        const jwt =
          cookies?.get(REFRESH_COOKIE) ||
          context.requestHeader.get('authorization')?.split(' ')[1];
        const { refreshToken, user } = await client.signInOrUp({
          refreshToken: jwt,
          workspaceId: request.workspaceId,
        });
        const { exp } = parseJwt(refreshToken);
        const domain =
          process.env.NODE_ENV === 'production' ? 'Domain=dopt.com;' : '';
        context.responseHeader.set(
          'Set-Cookie',
          `DSR=${refreshToken}; Path=/; ${domain} Expires=${exp}; HttpOnly; Secure; SameSite=Strict`
        );
        return new SignInOrUpResponse({ user, refreshToken });
      },
    },
  },
  {
    middleware: [validate.session],
    method: 'inviteUser',
    implementation: {
      inviteUser: async (request) => {
        return await client.inviteUser({
          ...request,
        });
      },
    },
  },
  {
    middleware: [validate.session],
    method: 'updateUserStatus',
    implementation: {
      updateUserStatus: async (request, context) => {
        const authHeader = context.requestHeader.get('authorization') || '';
        const token = parseJwt(authHeader);
        const { status } = await client.validateUserInWorkspace({
          userId: request.userId,
          workspaceId: token.workspaceId,
        });
        if (status?.code) {
          throw new Error(`Error Validating user code: ${status.code}`);
        }
        const { status: responseStatus } = await client.updateUserStatus({
          userId: request.userId,
          workspaceId: token.workspaceId,
          status: request.status,
        });
        if (responseStatus?.code) {
          throw new Error(`Error Validating user code: ${responseStatus.code}`);
        }
        return new UpdateUserStatusResponse({
          status: { code: STATUS.OK },
        });
      },
    },
  },
];
