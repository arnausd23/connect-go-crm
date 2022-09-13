import { createRouter } from './context';
import { signInSchema } from '../common/validation/auth';
import * as trpc from '@trpc/server';
import { hash } from 'argon2';

export const userRouter = createRouter().mutation('signUp', {
  input: signInSchema,
  async resolve({ input, ctx }) {
    const { username, password } = input;
    const exists = await ctx.prisma.user.findFirst({ where: { id: username } });

    if (exists) {
      throw new trpc.TRPCError({
        code: 'CONFLICT',
        message: 'User already exists.',
      });
    }

    const hashedPassword: string = await hash(password);
    const user = await ctx.prisma.user.create({
      data: {
        id: username,
        ci: username,
        password: hashedPassword,
      },
    });

    return user;
  },
});
