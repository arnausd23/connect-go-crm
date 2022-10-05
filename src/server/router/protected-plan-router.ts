import {
  createPlanSchema,
  deleteSchema,
  editPlanSchema,
  paginationSchema,
} from '../common/validation/schemas';
import { createProtectedRouter } from './protected-router';
import * as trpc from '@trpc/server';
import { ERROR_MESSAGE } from '../../utils/constants';

export const protectedPlanRouter = createProtectedRouter()
  .query('getAll', {
    input: paginationSchema,
    async resolve({ input, ctx }) {
      const { skip, take } = input;
      const plans = await ctx.prisma.plan.findMany({
        skip,
        take,
      });
      const numberOfAccessHistory = await ctx.prisma.accessHistory.count();
      const pageCount = Math.ceil(numberOfAccessHistory / take!);
      return { plans, pageCount };
    },
  })
  .mutation('create', {
    input: createPlanSchema,
    async resolve({ input, ctx }) {
      const { accessType, name, price } = input;
      const parsedPrice: number = price ? parseInt(price) : 0;

      const exists = await ctx.prisma.plan.findFirst({ where: { name } });

      if (exists) {
        throw new trpc.TRPCError({
          code: 'CONFLICT',
          message: ERROR_MESSAGE.DuplicatePlan,
        });
      }

      const updatedBy = Object.entries(ctx.session).filter(
        (entry) => entry[0] === 'id'
      )[0]![1] as string;

      const plan = await ctx.prisma.plan.create({
        data: {
          accessType,
          name,
          price: parsedPrice,
          updatedBy,
        },
      });

      return plan;
    },
  })
  .mutation('edit', {
    input: editPlanSchema,
    async resolve({ input, ctx }) {
      const { id, name, accessType, price } = input;
      const parsedPrice: number = price ? parseInt(price) : 0;

      const exists = await ctx.prisma.plan.findFirst({ where: { name } });

      if (exists && id !== exists.id) {
        throw new trpc.TRPCError({
          code: 'CONFLICT',
          message: ERROR_MESSAGE.DuplicatePlan,
        });
      }

      const updatedBy = Object.entries(ctx.session).filter(
        (entry) => entry[0] === 'id'
      )[0]![1] as string;

      await ctx.prisma.plan.update({
        where: { id },
        data: { name, accessType, price: parsedPrice, updatedBy },
      });
    },
  })
  .mutation('delete', {
    input: deleteSchema,
    async resolve({ input, ctx }) {
      const { id } = input;
      await ctx.prisma.plan.delete({ where: { id } });
    },
  });
