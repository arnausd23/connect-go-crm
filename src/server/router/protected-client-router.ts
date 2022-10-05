import {
  assignPlanSchema,
  createClientSchema,
  deleteSchema,
  editClientSchema,
  editUserPlanSchema,
  exportClientsSchema,
  paginationSchema,
} from '../common/validation/schemas';
import { createProtectedRouter } from './protected-router';
import * as trpc from '@trpc/server';
import { ERROR_MESSAGE } from '../../utils/constants';
import { v2 as cloudinary } from 'cloudinary';

export const protectedClientRouter = createProtectedRouter()
  .query('getPhotoUrls', {
    async resolve() {
      try {
        const { resources } = await cloudinary.search
          .expression('folder:connect-crm/*')
          .execute();
        return resources.map((resource: any) => resource.secure_url);
      } catch (error) {
        throw new trpc.TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: ERROR_MESSAGE.FailedToLoadModels,
        });
      }
    },
  })
  .query('getPlans', {
    input: paginationSchema,
    async resolve({ input, ctx }) {
      const { skip, take } = input;
      const plans = await ctx.prisma.userPlan.findMany({
        skip,
        take,
        select: {
          id: true,
          startingDate: true,
          endingDate: true,
          updatedBy: true,
          user: { select: { name: true } },
          plan: { select: { name: true } },
        },
      });

      const numberOfUserPlans = await ctx.prisma.userPlan.count();
      const pageCount = Math.ceil(numberOfUserPlans / take!);

      return { plans, pageCount };
    },
  })
  .query('getAll', {
    input: paginationSchema,
    async resolve({ input, ctx }) {
      const { skip, take } = input;
      const clients = await ctx.prisma.user.findMany({
        skip,
        take,
        where: {
          password: null,
        },
        select: {
          id: true,
          name: true,
          ci: true,
          phoneNumber: true,
          updatedBy: true,
        },
      });

      const numberOfClients = await ctx.prisma.user.count({
        where: { password: null },
      });
      const pageCount = Math.ceil(numberOfClients / take!);

      return { clients, pageCount };
    },
  })
  .query('exportAll', {
    input: exportClientsSchema,
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
  .mutation('editPlan', {
    input: editUserPlanSchema,
    async resolve({ input, ctx }) {
      const { id, startingDate, endingDate } = input;
      const updatedBy = Object.entries(ctx.session).filter(
        (entry) => entry[0] === 'id'
      )[0]![1] as string;

      await ctx.prisma.userPlan.update({
        where: { id },
        data: { startingDate, endingDate, updatedBy },
      });
    },
  })
  .mutation('edit', {
    input: editClientSchema,
    async resolve({ input, ctx }) {
      const { id, name, phoneNumber } = input;
      const updatedBy = Object.entries(ctx.session).filter(
        (entry) => entry[0] === 'id'
      )[0]![1] as string;

      await ctx.prisma.user.update({
        where: { id },
        data: { name, phoneNumber, updatedBy },
      });
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
      const { id } = input;
      await ctx.prisma.user.delete({ where: { id } });
    },
  })
  .mutation('create', {
    input: createClientSchema,
    async resolve({ input, ctx }) {
      const { ci, name, phoneNumber, photoSrc } = input;

      const exists = await ctx.prisma.user.findFirst({ where: { ci } });

      if (exists) {
        throw new trpc.TRPCError({
          code: 'CONFLICT',
          message: ERROR_MESSAGE.DuplicateClient,
        });
      }

      try {
        await cloudinary.uploader.unsigned_upload(photoSrc, 'connect-crm', {
          public_id: ci,
        });
      } catch {
        throw new trpc.TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: ERROR_MESSAGE.FailedToSavePhoto,
        });
      }

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
      const { ci, name, startingDate, endingDate } = input;
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
        },
      });

      return userPlan;
    },
  });
