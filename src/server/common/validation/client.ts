import { z } from 'zod';

export const createClientSchema = z.object({
  ci: z.string(),
  name: z.string(),
  phoneNumber: z.string(),
});

export type ICreateClient = z.infer<typeof createClientSchema>;
