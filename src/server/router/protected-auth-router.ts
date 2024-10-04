import * as trpc from "@trpc/server";
import { ERROR_MESSAGE } from "../../utils/constants";
import { authSchema, updatePasswordSchema } from "../common/validation/schemas";
import { createProtectedRouter } from "./protected-router";

export const protectedAuthRouter = createProtectedRouter()
  .mutation("signUp", {
    input: authSchema,
    async resolve({ input, ctx }) {
      const { username, password } = input;

      // Look up user by name (matching `auth` logic)
      const exists = await ctx.prisma.user.findFirst({
        where: { name: username },
      });

      if (exists) {
        throw new trpc.TRPCError({
          code: "CONFLICT",
          message: ERROR_MESSAGE.DuplicateUser,
        });
      }

      // No password hashing, store plain text (to match `auth`)
      const user = await ctx.prisma.user.create({
        data: {
          name: username, // Use `name` instead of `id`
          ci: username,
          password: password, // Directly store password without hashing
          updatedBy: username,
        },
      });

      return user;
    },
  })
  .mutation("updatePassword", {
    input: updatePasswordSchema,
    async resolve({ input, ctx }) {
      const { newPassword, repeatedNewPassword } = input;

      if (newPassword !== repeatedNewPassword) {
        throw new trpc.TRPCError({
          code: "BAD_REQUEST",
          message: ERROR_MESSAGE.PasswordMismatch,
        });
      }

      const id = Object.entries(ctx.session).filter(
        (entry) => entry[0] === "id"
      )[0]![1] as string;

      // Update password directly (no hashing)
      await ctx.prisma.user.update({
        where: { id },
        data: { password: newPassword },
      });
    },
  });
