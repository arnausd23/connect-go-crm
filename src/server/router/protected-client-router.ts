import { createClientSchema } from '../common/validation/schemas';
import { createProtectedRouter } from './protected-router';
import * as trpc from '@trpc/server';
import { ERROR_MESSAGES } from '../../utils/constants';

export const protectedClientRouter = createProtectedRouter().mutation(
  'create',
  {
    input: createClientSchema,
    async resolve({ input, ctx }) {
      const { ci, name, phoneNumber } = input;
      const exists = await ctx.prisma.user.findFirst({ where: { ci } });

      if (exists) {
        throw new trpc.TRPCError({
          code: 'CONFLICT',
          message: ERROR_MESSAGES.DuplicateClient,
        });
      }

      const client = await ctx.prisma.user.create({
        data: {
          ci,
          name,
          phoneNumber,
        },
      });

      return client;
    },
  }
);
