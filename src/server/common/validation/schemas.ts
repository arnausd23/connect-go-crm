import { z } from 'zod';
import { ERROR_MESSAGES, PLANS } from '../../../utils/constants';

export const signInSchema = z.object({
  username: z.string(),
  password: z.string(),
});

export const createClientSchema = z.object({
  ci: z.string(),
  name: z.string().trim().min(1, { message: ERROR_MESSAGES.EmptyName }),
  phoneNumber: z.string(),
});

export const createPlanSchema = z.object({
  accessType: z.enum([PLANS.Everyday, PLANS.OneSession, PLANS.ThreePerWeek]),
  name: z.string().trim().min(1, { message: ERROR_MESSAGES.EmptyName }),
  price: z.string(),
});

export type ISignIn = z.infer<typeof signInSchema>;
export type ICreateClient = z.infer<typeof createClientSchema>;
export type ICreatePlan = z.infer<typeof createPlanSchema>;
