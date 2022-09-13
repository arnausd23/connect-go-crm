import { createRouter } from './context';
import superjson from 'superjson';

import { userRouter } from './user';
import { protectedClientRouter } from './protected-client-router';

export const appRouter = createRouter()
  .transformer(superjson)
  .merge('user.', userRouter)
  .merge('client.', protectedClientRouter);

export type AppRouter = typeof appRouter;
