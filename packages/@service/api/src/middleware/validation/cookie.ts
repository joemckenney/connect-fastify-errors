import { Middleware } from '../../types';
import { BadRequestError } from '@dopt/error';
import { refreshAuthChecker } from '@dopt/auth-utils';
import { REFRESH_COOKIE } from '../../const/session';
import { parseCookieHeader } from '../../utils/cookie';

export const cookie: Middleware = async (_, context) => {
  const cookies = parseCookieHeader(context.requestHeader.get('cookie'));
  const refreshJWT =
    cookies?.get(REFRESH_COOKIE) ||
    context.requestHeader.get('authorization')?.split(' ')[1];
  if (!refreshJWT) {
    throw new BadRequestError({
      internalErrorMessage: 'No auth header provided',
      externalErrorMessage: 'No auth header provided',
    });
  }
  await refreshAuthChecker(refreshJWT);
};
