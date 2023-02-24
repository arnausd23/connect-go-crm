import {
  assignPlanSchema,
  createClientSchema,
  deleteSchema,
  editClientSchema,
  editUserPlanSchema,
  exportSchema,
  exportUserPlansSchema,
  getClientsSchema,
  getUserPlansSchema,
  IExportUserPlans,
} from '../common/validation/schemas';
import { createProtectedRouter } from './protected-router';
import * as trpc from '@trpc/server';
import { ERROR_MESSAGE } from '../../utils/constants';

export const protectedClientRouter = createProtectedRouter()
  .query('getPlans', {
    input: getUserPlansSchema,
    async resolve({ input, ctx }) {
      const { skip, take, userName, planName, startingDate, endingDate } =
        input;
      const newEndingDate = endingDate
        ? new Date(endingDate.valueOf())
        : undefined;
      newEndingDate?.setHours(23, 59, 59, 999);

      const plans = await ctx.prisma.userPlan.findMany({
        skip: skip && take ? skip * take : undefined,
        take,
        select: {
          id: true,
          startingDate: true,
          endingDate: true,
          updatedBy: true,
          parking: true,
          groupClasses: true,
          freezedDays: true,
          freezedStartingDate: true,
          additionalInfo: true,
          user: { select: { name: true } },
          plan: { select: { name: true } },
        },
        where: {
          user: userName
            ? {
                name: {
                  contains: userName,
                },
              }
            : undefined,
          plan: planName
            ? {
                name: {
                  contains: planName,
                },
              }
            : undefined,
          startingDate: startingDate ? { gte: startingDate } : undefined,
          endingDate: endingDate ? { lte: newEndingDate } : undefined,
        },
        orderBy: {
          createdAt: 'desc',
        },
      });

      const numberOfUserPlans = await ctx.prisma.userPlan.count({
        where: {
          user: userName
            ? {
                name: {
                  contains: userName,
                },
              }
            : undefined,
          plan: planName
            ? {
                name: {
                  contains: planName,
                },
              }
            : undefined,
          startingDate: startingDate ? { gte: startingDate } : undefined,
          endingDate: endingDate ? { lte: newEndingDate } : undefined,
        },
      });
      const pageCount = Math.ceil(numberOfUserPlans / take!);

      return { plans, pageCount };
    },
  })
  .query('getAll', {
    input: getClientsSchema,
    async resolve({ input, ctx }) {
      const { skip, take, name, ci } = input;
      const clients = await ctx.prisma.user.findMany({
        skip: skip && take ? skip * take : undefined,
        take,
        where: {
          password: null,
          name: name
            ? {
                contains: name,
              }
            : undefined,
          ci: ci
            ? {
                contains: ci,
              }
            : undefined,
        },
        select: {
          id: true,
          name: true,
          ci: true,
          phoneNumber: true,
          updatedBy: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
      });

      const numberOfClients = await ctx.prisma.user.count({
        where: {
          password: null,
          name: name
            ? {
                contains: name,
              }
            : undefined,
          ci: ci
            ? {
                contains: ci,
              }
            : undefined,
        },
      });
      const pageCount = Math.ceil(numberOfClients / take!);

      return { clients, pageCount };
    },
  })
  .query('exportAll', {
    input: exportSchema,
    async resolve({ ctx }) {
      const clients = await ctx.prisma.user.findMany({
        where: {
          password: null,
        },
        select: {
          name: true,
          ci: true,
          phoneNumber: true,
          updatedBy: true,
        },
      });

      return clients;
    },
  })
  .query('exportPlans', {
    input: exportUserPlansSchema,
    async resolve({ input, ctx }) {
      const { userName, planName, startingDate, endingDate } = input;
      const newEndingDate = endingDate
        ? new Date(endingDate.valueOf())
        : undefined;
      newEndingDate?.setHours(23, 59, 59, 999);
      const userPlans = await ctx.prisma.userPlan.findMany({
        select: {
          startingDate: true,
          endingDate: true,
          updatedBy: true,
          parking: true,
          groupClasses: true,
          user: { select: { name: true } },
          plan: { select: { name: true } },
        },
        where: {
          user: userName
            ? {
                name: {
                  contains: userName,
                },
              }
            : undefined,
          plan: planName
            ? {
                name: {
                  contains: planName,
                },
              }
            : undefined,
          startingDate: startingDate ? { gte: startingDate } : undefined,
          endingDate: endingDate ? { lte: newEndingDate } : undefined,
        },
      });
      const plans: Omit<IExportUserPlans, 'fileName'>[] = [];
      userPlans.forEach((userPlan) => {
        const {
          startingDate,
          endingDate,
          user,
          plan,
          updatedBy,
          parking,
          groupClasses,
        } = userPlan;
        const newPlan = {
          userName: user.name,
          userPlan: plan.name,
          startingDate,
          endingDate,
          updatedBy,
          parking: parking ? 'Sí' : 'No',
          groupClasses: groupClasses ? 'Sí' : 'No',
        };
        plans.push(newPlan);
      });

      return plans;
    },
  })
  .mutation('editPlan', {
    input: editUserPlanSchema,
    async resolve({ input, ctx }) {
      const {
        id,
        startingDate,
        endingDate,
        parking,
        groupClasses,
        freezedDays,
        freezedStartingDate,
        additionalInfo,
      } = input;
      const updatedBy = Object.entries(ctx.session).filter(
        (entry) => entry[0] === 'id'
      )[0]![1] as string;

      const parsedFreezedDays: number = freezedDays ? parseInt(freezedDays) : 0;

      await ctx.prisma.userPlan.update({
        where: { id },
        data: {
          startingDate,
          endingDate,
          updatedBy,
          parking,
          groupClasses,
          freezedDays: parsedFreezedDays,
          freezedStartingDate,
          additionalInfo,
        },
      });
    },
  })
  .mutation('edit', {
    input: editClientSchema,
    async resolve({ input, ctx }) {
      const { id, name, phoneNumber, editPhoto, labeledFaceDescriptor } = input;
      const updatedBy = Object.entries(ctx.session).filter(
        (entry) => entry[0] === 'id'
      )[0]![1] as string;

      const user = await ctx.prisma.user.update({
        where: { id },
        data: { name, phoneNumber, updatedBy },
      });

      if (editPhoto) {
        const userLabeledFaceDescriptor =
          await ctx.prisma.labeledFaceDescriptor.findFirst({
            where: { ci: user.ci },
          });
        const data = userLabeledFaceDescriptor!.data as {
          label: string;
          descriptors: any;
        };
        const newDescriptors = Array.from(labeledFaceDescriptor);
        data.descriptors = [...data.descriptors, newDescriptors];

        await ctx.prisma.labeledFaceDescriptor.update({
          where: { id: userLabeledFaceDescriptor?.id },
          data: { data },
        });
      }
    },
  })
  .mutation('deletePlan', {
    input: deleteSchema,
    async resolve({ input, ctx }) {
      const { id } = input;
      await ctx.prisma.userPlan.delete({ where: { id } });
    },
  })
  .mutation('delete', {
    input: deleteSchema,
    async resolve({ input, ctx }) {
      const { id, ci } = input;
      await ctx.prisma.labeledFaceDescriptor.delete({ where: { ci } });
      await ctx.prisma.user.delete({ where: { id } });
    },
  })
  .mutation('create', {
    input: createClientSchema,
    async resolve({ input, ctx }) {
      const { ci, name, phoneNumber, labeledFaceDescriptorJson } = input;

      const exists = await ctx.prisma.user.findFirst({ where: { ci } });

      if (exists) {
        throw new trpc.TRPCError({
          code: 'CONFLICT',
          message: ERROR_MESSAGE.DuplicateClient,
        });
      }

      await ctx.prisma.labeledFaceDescriptor.create({
        data: {
          ci,
          data: labeledFaceDescriptorJson,
        },
      });

      const updatedBy = Object.entries(ctx.session).filter(
        (entry) => entry[0] === 'id'
      )[0]![1] as string;

      const client = await ctx.prisma.user.create({
        data: {
          ci,
          name,
          phoneNumber,
          updatedBy,
        },
      });

      return client;
    },
  })
  .mutation('assignPlan', {
    input: assignPlanSchema,
    async resolve({ input, ctx }) {
      const { ci, name, startingDate, endingDate, parking, groupClasses } =
        input;
      const user = await ctx.prisma.user.findFirst({ where: { ci } });
      if (!user) {
        throw new trpc.TRPCError({
          code: 'NOT_FOUND',
          message: ERROR_MESSAGE.ClientNotFound,
        });
      }

      const plan = await ctx.prisma.plan.findFirst({ where: { name } });
      if (!plan) {
        throw new trpc.TRPCError({
          code: 'NOT_FOUND',
          message: ERROR_MESSAGE.PlanNotFound,
        });
      }

      const updatedBy = Object.entries(ctx.session).filter(
        (entry) => entry[0] === 'id'
      )[0]![1] as string;

      const userPlan = await ctx.prisma.userPlan.create({
        data: {
          userId: user.id,
          planId: plan.id,
          startingDate,
          endingDate,
          updatedBy,
          parking,
          groupClasses,
        },
      });

      return userPlan;
    },
  });
