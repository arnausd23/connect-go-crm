import { createRouter } from './context';
import superjson from 'superjson';

import { protectedAuthRouter } from './protected-auth-router';
import { protectedClientRouter } from './protected-client-router';
import { protectedPlanRouter } from './protected-plan-router';
import { ZodError } from 'zod';
import { protectedAccessHistoryRouter } from './protected-access-history-router';
import { protectedLabeledFaceDescriptorRouter } from './protected-labeled-face-descriptor-router';

export const appRouter = createRouter()
  .transformer(superjson)
  .merge('auth.', protectedAuthRouter)
  .merge('client.', protectedClientRouter)
  .merge('plan.', protectedPlanRouter)
  .merge('accessHistory.', protectedAccessHistoryRouter)
  .merge('labeledFaceDescriptor.', protectedLabeledFaceDescriptorRouter)
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
