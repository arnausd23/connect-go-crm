import { createRouter } from './context';
import superjson from 'superjson';

import { userRouter } from './user';
import { protectedClientRouter } from './protected-client-router';
import { protectedPlanRouter } from './protected-plan-router';
import { ZodError } from 'zod';

export const appRouter = createRouter()
  .transformer(superjson)
  .merge('user.', userRouter)
  .merge('client.', protectedClientRouter)
  .merge('plan.', protectedPlanRouter)
  .formatError(({ shape, error }) => {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError:
          error.code === 'BAD_REQUEST' && error.cause instanceof ZodError
            ? error.cause.flatten()
            : null,
      },
    };
  });

export type AppRouter = typeof appRouter;
