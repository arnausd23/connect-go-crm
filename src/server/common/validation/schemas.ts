import { z } from 'zod';
import { ERROR_MESSAGE, PLAN_ACCESS_TYPE } from '../../../utils/constants';

export const signInSchema = z.object({
  username: z.string(),
  password: z.string(),
});

export const createClientSchema = z.object({
  ci: z.string().trim().min(7, { message: ERROR_MESSAGE.InvalidCI }),
  name: z.string().trim().min(1, { message: ERROR_MESSAGE.EmptyName }),
  phoneNumber: z.string(),
  photoSrc: z.string().trim().min(1, { message: ERROR_MESSAGE.EmptyPhoto }),
  photoTaken: z.boolean().optional(),
});

export const createPlanSchema = z.object({
  accessType: z.enum([
    PLAN_ACCESS_TYPE.Unlimited,
    PLAN_ACCESS_TYPE.OneSession,
    PLAN_ACCESS_TYPE.ThreePerWeek,
  ]),
  name: z.string().trim().min(1, { message: ERROR_MESSAGE.EmptyName }),
  price: z.string(),
});

export const assignPlanSchema = z.object({
  ci: z.string().trim().min(7, { message: ERROR_MESSAGE.InvalidCI }),
  endingDate: z.date(),
  name: z.string().trim().min(1, { message: ERROR_MESSAGE.EmptyName }),
  startingDate: z.date(),
});

export const createAccessHistorySchema = z.object({
  ci: z.string(),
  date: z.date(),
});

export const paginationSchema = z.object({
  skip: z.number().optional(),
  take: z.number().optional(),
});

export const editUserPlanSchema = z.object({
  id: z.string(),
  startingDate: z.date(),
  endingDate: z.date(),
});

export const editPlanSchema = z.object({
  id: z.string(),
  name: z.string().trim().min(1, { message: ERROR_MESSAGE.EmptyName }),
  accessType: z.enum([
    PLAN_ACCESS_TYPE.Unlimited,
    PLAN_ACCESS_TYPE.OneSession,
    PLAN_ACCESS_TYPE.ThreePerWeek,
  ]),
  price: z.string(),
});

export const deleteSchema = z.object({
  id: z.string(),
});

export type ISignIn = z.infer<typeof signInSchema>;
export type ICreateClient = z.infer<typeof createClientSchema>;
export type ICreatePlan = z.infer<typeof createPlanSchema>;
export type IAssignPlan = z.infer<typeof assignPlanSchema>;
export type ICreateAccessHistory = z.infer<typeof createAccessHistorySchema>;
export type IEditUserPlan = z.infer<typeof editUserPlanSchema>;
export type IEditPlan = z.infer<typeof editPlanSchema>;
