import { verify } from 'argon2';
import * as trpc from '@trpc/server';
import { prisma } from '../../../server/db/client';
import { ERROR_MESSAGE } from '../../../utils/constants';
import { signInSchema } from './schemas';

export const authorizeSignIn = async (
  credentials: Record<never, string> | undefined
) => {
  const parsedCredentials = await signInSchema.parseAsync(credentials);
  const user = await prisma.user.findFirst({
    where: { id: parsedCredentials.username },
  });

  if (!user) {
    throw new trpc.TRPCError({
      code: 'NOT_FOUND',
      message: ERROR_MESSAGE.UserNotFound,
    });
  }

  const isValidPassword = await verify(
    user.password!,
    parsedCredentials.password
  );

  if (!isValidPassword) {
    throw new trpc.TRPCError({
      code: 'BAD_REQUEST',
      message: ERROR_MESSAGE.InvalidCredentials,
    });
  }

  return user;
};
