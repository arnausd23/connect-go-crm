import * as trpc from '@trpc/server';
import { hash } from 'argon2';
import { ERROR_MESSAGE } from '../../utils/constants';
import { authSchema } from '../common/validation/schemas';
import { createProtectedRouter } from './protected-router';

export const protectedAuthRouter = createProtectedRouter().mutation('signUp', {
  input: authSchema,
  async resolve({ input, ctx }) {
    const { username, password } = input;
    const exists = await ctx.prisma.user.findFirst({ where: { id: username } });

    if (exists) {
      throw new trpc.TRPCError({
        code: 'CONFLICT',
        message: ERROR_MESSAGE.DuplicateUser,
      });
    }

    const hashedPassword: string = await hash(password);
    const user = await ctx.prisma.user.create({
      data: {
        id: username,
        ci: username,
        password: hashedPassword,
        updatedBy: username,
      },
    });

    return user;
  },
});
