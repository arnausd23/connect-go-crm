import { z } from 'zod';
import { ERROR_MESSAGE, PLAN_ACCESS_TYPE } from '../../../utils/constants';

export const authSchema = z.object({
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

export const getUserPlansSchema = z.object({
  skip: z.number().optional(),
  take: z.number().optional(),
  userName: z.string().optional(),
  planName: z.string().optional(),
  startingDate: z.date().optional(),
  endingDate: z.date().optional(),
});

export const getClientsSchema = z.object({
  skip: z.number().optional(),
  take: z.number().optional(),
  name: z.string().optional(),
  ci: z.string().optional(),
});

export const editUserPlanSchema = z.object({
  id: z.string(),
  startingDate: z.date(),
  endingDate: z.date(),
});

export const editClientSchema = z.object({
  id: z.string(),
  name: z.string().trim().min(1, { message: ERROR_MESSAGE.EmptyName }),
  phoneNumber: z.string(),
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
  ci: z.string().optional(),
});

export const updatePasswordSchema = z.object({
  newPassword: z
    .string()
    .trim()
    .min(8, { message: ERROR_MESSAGE.InvalidPassword }),
  repeatedNewPassword: z
    .string()
    .trim()
    .min(8, { message: ERROR_MESSAGE.InvalidPassword }),
});

export const exportSchema = z.object({
  fileName: z.string().trim().min(1, { message: ERROR_MESSAGE.EmptyName }),
});

export const exportUserPlansSchema = z.object({
  fileName: z.string().trim().min(1, { message: ERROR_MESSAGE.EmptyName }),
  userName: z.string().optional(),
  planName: z.string().optional(),
  startingDate: z.date().optional(),
  endingDate: z.date().optional(),
});

export type IAuth = z.infer<typeof authSchema>;
export type ICreateClient = z.infer<typeof createClientSchema>;
export type ICreatePlan = z.infer<typeof createPlanSchema>;
export type IAssignPlan = z.infer<typeof assignPlanSchema>;
export type ICreateAccessHistory = z.infer<typeof createAccessHistorySchema>;
export type IEditUserPlan = z.infer<typeof editUserPlanSchema>;
export type IEditPlan = z.infer<typeof editPlanSchema>;
export type IEditClient = z.infer<typeof editClientSchema>;
export type IUpdatePassword = z.infer<typeof updatePasswordSchema>;
export type IExport = z.infer<typeof exportSchema>;
export type IExportUserPlans = z.infer<typeof exportUserPlansSchema>;
export type IGetUserPlans = z.infer<typeof getUserPlansSchema>;
export type IGetClients = z.infer<typeof getClientsSchema>;
