import { ZodError } from 'zod';
import { createPlanSchema } from '../common/validation/schemas';
import { createProtectedRouter } from './protected-router';

export const protectedPlanRouter = createProtectedRouter().mutation('create', {
  input: createPlanSchema,
  async resolve({ input, ctx }) {
    const { accessType, name, price } = input;
    const parsedPrice: number = price ? parseInt(price) : 0;

    const plan = await ctx.prisma.plan.create({
      data: {
        accessType,
        name,
        price: parsedPrice,
      },
    });

    return plan;
  },
});
