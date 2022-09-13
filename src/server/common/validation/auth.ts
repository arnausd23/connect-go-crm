import { z } from 'zod';
import { verify } from 'argon2';
import * as trpc from '@trpc/server';
import { prisma } from '../../../server/db/client';
import { ERROR_MESSAGES } from '../../../utils/constants';

export const signInSchema = z.object({
  username: z.string(),
  password: z.string(),
});

export type IAuth = z.infer<typeof signInSchema>;

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
      message: ERROR_MESSAGES.NotFound,
    });
  }

  const isValidPassword = await verify(
    user.password!,
    parsedCredentials.password
  );

  if (!isValidPassword) {
    throw new trpc.TRPCError({
      code: 'BAD_REQUEST',
      message: ERROR_MESSAGES.InvalidCredentials,
    });
  }

  return user;
};
