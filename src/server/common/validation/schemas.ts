import { z } from 'zod';
import { ERROR_MESSAGES, PLANS } from '../../../utils/constants';

export const signInSchema = z.object({
  username: z.string(),
  password: z.string(),
});

export const createClientSchema = z.object({
  ci: z.string().trim().min(7, { message: ERROR_MESSAGES.InvalidCI }),
  name: z.string().trim().min(1, { message: ERROR_MESSAGES.EmptyName }),
  phoneNumber: z.string(),
  photoSrc: z.string().optional(),
  photoTaken: z.boolean().optional(),
});

export const createPlanSchema = z.object({
  accessType: z.enum([PLANS.Everyday, PLANS.OneSession, PLANS.ThreePerWeek]),
  name: z.string().trim().min(1, { message: ERROR_MESSAGES.EmptyName }),
  price: z.string(),
});

export const assignPlanSchema = z.object({
  ci: z.string().trim().min(7, { message: ERROR_MESSAGES.InvalidCI }),
  endingDate: z.date(),
  name: z.string().trim().min(1, { message: ERROR_MESSAGES.EmptyName }),
  startingDate: z.date(),
});

export type ISignIn = z.infer<typeof signInSchema>;
export type ICreateClient = z.infer<typeof createClientSchema>;
export type ICreatePlan = z.infer<typeof createPlanSchema>;
export type IAssignPlan = z.infer<typeof assignPlanSchema>;
