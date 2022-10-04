import {
  assignPlanSchema,
  createClientSchema,
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
          startingDate: true,
          endingDate: true,
          user: { select: { name: true } },
          plan: { select: { name: true } },
        },
      });

      const numberOfAccessHistory = await ctx.prisma.accessHistory.count();
      const pageCount = Math.ceil(numberOfAccessHistory / take);

      return { plans, pageCount };
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

      const client = await ctx.prisma.user.create({
        data: {
          ci,
          name,
          phoneNumber,
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

      const userPlan = await ctx.prisma.userPlan.create({
        data: {
          userId: user.id,
          planId: plan.id,
          startingDate,
          endingDate,
        },
      });

      return userPlan;
    },
  });
