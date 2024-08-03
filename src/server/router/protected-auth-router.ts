import * as trpc from '@trpc/server';
import { hash } from 'argon2';
import { ERROR_MESSAGE } from '../../utils/constants';
import { authSchema, updatePasswordSchema } from '../common/validation/schemas';
import { createProtectedRouter } from './protected-router';

export const protectedAuthRouter = createProtectedRouter()
  .mutation('signUp', {
    input: authSchema,
    async resolve({ input, ctx }) {
      const { username, password } = input;
      const exists = await ctx.prisma.user.findFirst({
        where: { id: username },
      });

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
  })
  .mutation('updatePassword', {
    input: updatePasswordSchema,
    async resolve({ input, ctx }) {
      const { newPassword, repeatedNewPassword } = input;

      if (newPassword !== repeatedNewPassword) {
        throw new trpc.TRPCError({
          code: 'BAD_REQUEST',
          message: ERROR_MESSAGE.PasswordMismatch,
        });
      }

      const hashedPassword: string = await hash(newPassword);

      const id = Object.entries(ctx.session).filter(
        (entry) => entry[0] === 'id'
      )[0]![1] as string;

      await ctx.prisma.user.update({
        where: { id },
        data: { password: hashedPassword },
      });
    },
  });
