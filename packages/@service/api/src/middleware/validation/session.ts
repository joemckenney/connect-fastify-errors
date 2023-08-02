import { Middleware } from '../../types';
import { BadRequestError } from '@dopt/error';
import { sessionAuthChecker } from '@dopt/auth-utils';

export const session: Middleware = async (_, context) => {
  const authHeader = context.requestHeader.get('authorization');
  if (!authHeader) {
    throw new BadRequestError({
      internalErrorMessage: 'No auth header provided',
      externalErrorMessage: 'No auth header provided',
    });
  }
  await sessionAuthChecker(authHeader);
};
