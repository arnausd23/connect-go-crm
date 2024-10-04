import * as trpc from "@trpc/server";
import { prisma } from "../../../server/db/client";
import { ERROR_MESSAGE } from "../../../utils/constants";
import { authSchema } from "./schemas";

export const authorizeSignIn = async (
  credentials: Record<never, string> | undefined
) => {
  const parsedCredentials = await authSchema.parseAsync(credentials);

  // Ensure `parsedCredentials.username` corresponds to `name`
  const user = await prisma.user.findFirst({
    where: { name: parsedCredentials.username }, // Use `name` for lookup
  });

  if (!user) {
    throw new trpc.TRPCError({
      code: "NOT_FOUND",
      message: ERROR_MESSAGE.UserNotFound,
    });
  }

  // Ensure password is provided
  if (!parsedCredentials.password) {
    throw new trpc.TRPCError({
      code: "BAD_REQUEST",
      message: ERROR_MESSAGE.InvalidCredentials,
    });
  }

  // Directly compare stored and provided passwords (assuming plain text passwords)
  if (user.password !== parsedCredentials.password) {
    throw new trpc.TRPCError({
      code: "BAD_REQUEST",
      message: ERROR_MESSAGE.InvalidCredentials,
    });
  }

  // Return the user if found and password validation passed
  return user;
};
