import * as trpc from '@trpc/server';
import { ERROR_MESSAGE } from '../../utils/constants';
import {
  createPlanSchema,
  deleteSchema,
  editPlanSchema,
  exportSchema,
  paginationSchema,
} from '../common/validation/schemas';
import { createProtectedRouter } from './protected-router';

export const protectedPlanRouter = createProtectedRouter()
  .query('getAll', {
    input: paginationSchema,
    async resolve({ input, ctx }) {
      const { skip, take } = input;

      const plans = await ctx.prisma.plan.findMany({
        skip: skip && take ? skip * take : undefined,
        take,
        where: {
          disp: {
            in: ["Go", "Ambos"], // Filtra los planes que están disponibles en "Connect" o "Ambos"
          },
        },
      });

      const numberOfPlans = await ctx.prisma.plan.count({
        where: {
          disp: {
            in: ["Go", "Ambos"], // Filtra el conteo total de planes para "Connect" o "Ambos"
          },
        },
      });

      const pageCount = Math.ceil(numberOfPlans / take!);
      return { plans, pageCount };
    },
  })
  .mutation('create', {
    input: createPlanSchema,
    async resolve({ input, ctx }) {
      const { accessType, name, price, hasHourRestriction, restrictionHours, disp } = input;
      const parsedPrice: number = price ? parseInt(price) : 0;

      const exists = await ctx.prisma.plan.findFirst({ where: { name } });

      if (exists) {
        throw new trpc.TRPCError({
          code: 'CONFLICT',
          message: ERROR_MESSAGE.DuplicatePlan,
        });
      }

      // Safely extract the user's name from session data or default to 'Unknown User'
      const updatedBy = ctx.session?.user?.name || 'Unknown User';

      const plan = await ctx.prisma.plan.create({
        data: {
          accessType,
          name,
          price: parsedPrice,
          updatedBy,
          hasHourRestriction,
          restrictionHours,
          disp,
        },
      });

      console.log(plan);
      return plan;
    },
  })

  .query('exportAll', {
    input: exportSchema,
    async resolve({ ctx }) {
      const plans = await ctx.prisma.plan.findMany({
        select: {
          name: true,
          accessType: true,
          price: true,
          updatedBy: true,
        },
        where: {
          disp: {
            in: ["Go", "Ambos"], // Filtra los planes que están disponibles en "Connect" o "Ambos"
          },
        },
      });

      return plans;
    },
  })
  .mutation('edit', {
    input: editPlanSchema,
    async resolve({ input, ctx }) {
      const {
        id,
        name,
        accessType,
        price,
        hasHourRestriction,
        restrictionHours,
        disp,
      } = input;
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
        data: {
          name,
          accessType,
          price: parsedPrice,
          updatedBy,
          hasHourRestriction,
          restrictionHours,
          disp,
        },
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
