import * as trpc from "@trpc/server";
import { ERROR_MESSAGE } from "../../utils/constants";
import {
  assignPlanSchema,
  createClientSchema,
  deleteSchema,
  editClientSchema,
  editUserPlanSchema,
  exportSchema,
  exportUserPlansSchema,
  getClientsSchema,
  getUserPlansSchema,
  IExportUserPlans,
} from "../common/validation/schemas";
import { createProtectedRouter } from "./protected-router";

export const protectedClientRouter = createProtectedRouter()
  .query("getPlans", {
    input: getUserPlansSchema,
    async resolve({ input, ctx }) {
      const { skip, take, userName, planName, startingDate, endingDate } =
        input;
      const newEndingDate = endingDate
        ? new Date(endingDate.valueOf())
        : undefined;
      newEndingDate?.setHours(23, 59, 59, 999);

      const plans = await ctx.prisma.userPlan.findMany({
        skip: skip && take ? skip * take : undefined,
        take,
        select: {
          id: true,
          startingDate: true,
          endingDate: true,
          updatedBy: true,
          parking: true,
          groupClasses: true,
          freezedDays: true,
          freezedStartingDate: true,
          additionalInfo: true,
          user: { select: { name: true } },
          plan: {
            select: {
              name: true,
              disp: true, // Selecciona el campo 'disp' para asegurar que se incluye en la consulta
            },
          },
        },
        where: {
          plan: {
            disp: {
              in: ["Go", "Ambos"], // Filtra los planes disponibles en "Connect" o "Ambos"
            },
            name: planName
              ? {
                  contains: planName,
                }
              : undefined,
          },
          user: userName
            ? {
                name: {
                  contains: userName,
                },
              }
            : undefined,
          startingDate: startingDate ? { gte: startingDate } : undefined,
          endingDate: endingDate ? { lte: newEndingDate } : undefined,
        },
        orderBy: {
          createdAt: "desc",
        },
      });

      const numberOfUserPlans = await ctx.prisma.userPlan.count({
        where: {
          plan: {
            disp: {
              in: ["Go", "Ambos"], // Filtra el conteo total de planes para "Connect" o "Ambos"
            },
            name: planName
              ? {
                  contains: planName,
                }
              : undefined,
          },
          user: userName
            ? {
                name: {
                  contains: userName,
                },
              }
            : undefined,
          startingDate: startingDate ? { gte: startingDate } : undefined,
          endingDate: endingDate ? { lte: newEndingDate } : undefined,
        },
      });
      const pageCount = Math.ceil(numberOfUserPlans / take!);

      return { plans, pageCount };
    },
  })

  .query("getAll", {
    input: getClientsSchema,
    async resolve({ input, ctx }) {
      const { skip, take, name, ci } = input;

      // Build the query where clause dynamically based on provided filters
      const whereClause: any = {};

      if (name) {
        whereClause.name = {
          contains: name,
          mode: "insensitive", // Case insensitive search
        };
      }

      if (ci) {
        whereClause.ci = {
          contains: ci, // Allow partial matching
          mode: "insensitive", // Case insensitive search
        };
      }

      if (whereClause.ci === "") {
        whereClause.ci = undefined; // To handle empty strings in filters
      }

      // Query to get clients
      const clients = await ctx.prisma.user.findMany({
        skip: skip && take ? skip * take : undefined,
        take,
        where: {
          ...whereClause,
          password: null, // Filter clients with no password
        },
        select: {
          id: true,
          name: true,
          ci: true,
          phoneNumber: true,
          email: true,
          updatedBy: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      });

      // Count total clients matching the filter
      const numberOfClients = await ctx.prisma.user.count({
        where: {
          ...whereClause,
          password: null, // Filter clients with no password
        },
      });

      // Calculate total page count
      const pageCount = Math.ceil(numberOfClients / take!);

      return { clients, pageCount };
    },
  })

  .query("exportAll", {
    input: exportSchema,
    async resolve({ ctx }) {
      // Extract user name from session data
      const userName = ctx.session?.user?.name || "Unknown User";

      const clients = await ctx.prisma.user.findMany({
        where: {
          password: null,
        },
        select: {
          name: true,
          ci: true,
          phoneNumber: true,
          email: true,
          updatedBy: true,
        },
      });

      // Map clients to include the user's name in the 'updatedBy' field
      return clients.map((client) => ({
        ...client,
        updatedBy: userName,
      }));
    },
  })

  .query("exportPlans", {
    input: exportUserPlansSchema,
    async resolve({ input, ctx }) {
      const { userName, planName, startingDate, endingDate } = input;
      const newEndingDate = endingDate
        ? new Date(endingDate.valueOf())
        : undefined;
      newEndingDate?.setHours(23, 59, 59, 999);

      // Extract user name from session data
      const currentUserName = ctx.session?.user?.name || "Unknown User";

      const userPlans = await ctx.prisma.userPlan.findMany({
        select: {
          startingDate: true,
          endingDate: true,
          updatedBy: true,
          parking: true,
          groupClasses: true,
          user: { select: { name: true } },
          plan: {
            select: {
              name: true,
              disp: true, // Selecciona el campo 'disp' para asegurarte de que se incluye en la consulta
            },
          },
        },
        where: {
          plan: {
            disp: {
              in: ["Go", "Ambos"], // Filtra los planes disponibles en "Connect" o "Ambos"
            },
            name: planName
              ? {
                  contains: planName,
                }
              : undefined,
          },
          user: userName
            ? {
                name: {
                  contains: userName,
                },
              }
            : undefined,
          startingDate: startingDate ? { gte: startingDate } : undefined,
          endingDate: endingDate ? { lte: newEndingDate } : undefined,
        },
      });

      const plans: Omit<IExportUserPlans, "fileName">[] = userPlans.map(
        (userPlan) => {
          const {
            startingDate,
            endingDate,
            user,
            plan,
            updatedBy,
            parking,
            groupClasses,
          } = userPlan;
          return {
            userName: user.name,
            userPlan: plan.name,
            startingDate,
            endingDate,
            updatedBy: currentUserName, // Update the 'updatedBy' field with the current user's name
            parking: parking ? "Sí" : "No",
            groupClasses: groupClasses ? "Sí" : "No",
          };
        }
      );

      return plans;
    },
  })

  .mutation("editPlan", {
    input: editUserPlanSchema,
    async resolve({ input, ctx }) {
      const {
        id,
        startingDate,
        endingDate,
        parking,
        groupClasses,
        freezedDays,
        freezedStartingDate,
        additionalInfo,
      } = input;
      const updatedBy = Object.entries(ctx.session).filter(
        (entry) => entry[0] === "id"
      )[0]![1] as string;

      const parsedFreezedDays: number = freezedDays ? parseInt(freezedDays) : 0;

      await ctx.prisma.userPlan.update({
        where: { id },
        data: {
          startingDate,
          endingDate,
          updatedBy,
          parking,
          groupClasses,
          freezedDays: parsedFreezedDays,
          freezedStartingDate,
          additionalInfo,
        },
      });
    },
  })
  .mutation("edit", {
    input: editClientSchema,
    async resolve({ input, ctx }) {
      const {
        id,
        name,
        ci,
        phoneNumber,
        email,
        editPhoto,
        labeledFaceDescriptor,
      } = input;
      const updatedBy = ctx.session.user.name || "Unknown User";

      // Actualizar los datos básicos del usuario
      const user = await ctx.prisma.user.update({
        where: { id },
        data: { name, ci, phoneNumber, email, updatedBy },
      });

      // Si se debe editar la foto, manejar el descriptor facial
      if (editPhoto && labeledFaceDescriptor) {
        // Convertir el descriptor nuevo en un array de números
        const newDescriptors = Array.from(labeledFaceDescriptor).map(
          (value: unknown) => {
            if (typeof value === "number") {
              return value;
            } else {
              throw new Error("Invalid descriptor value, must be a number.");
            }
          }
        );

        // Buscar el descriptor facial del usuario
        const userLabeledFaceDescriptor =
          await ctx.prisma.labeledFaceDescriptor.findFirst({
            where: { ci: user.ci },
          });

        if (userLabeledFaceDescriptor) {
          // Extraer los datos actuales de los descriptores
          const data = userLabeledFaceDescriptor.data as {
            label: string;
            descriptors: number[][];
          };

          // Agregar el nuevo descriptor al array existente
          data.descriptors = [...data.descriptors, newDescriptors];

          // Actualizar el descriptor en la base de datos
          await ctx.prisma.labeledFaceDescriptor.update({
            where: { id: userLabeledFaceDescriptor.id },
            data: { data },
          });

          console.log(
            `Se actualizó el descriptor facial para el usuario con CI: ${ci}`
          );
        } else {
          // Si no existe, crear uno nuevo
          const newDescriptorData = {
            label: ci, // Usar el CI como etiqueta (label)
            descriptors: [newDescriptors], // Aseguramos que sea un array de arrays
          };

          await ctx.prisma.labeledFaceDescriptor.create({
            data: {
              ci: user.ci,
              data: newDescriptorData, // Guardar con el formato adecuado
            },
          });

          console.log(
            `Se creó un nuevo descriptor facial para el usuario con CI: ${ci}`
          );
        }
      }
    },
  })

  .mutation("deletePlan", {
    input: deleteSchema,
    async resolve({ input, ctx }) {
      const { id } = input;
      await ctx.prisma.userPlan.delete({ where: { id } });
    },
  })
  .mutation("delete", {
    input: deleteSchema,
    async resolve({ input, ctx }) {
      const { id, ci } = input;
      await ctx.prisma.labeledFaceDescriptor.delete({ where: { ci } });
      await ctx.prisma.user.delete({ where: { id } });
    },
  })

  //importante
  .mutation("create", {
    input: createClientSchema,
    async resolve({ input, ctx }) {
      const {
        ci,
        name,
        phoneNumber,
        email,
        labeledFaceDescriptorJson = "",
      } = input;

      const exists = await ctx.prisma.user.findFirst({ where: { ci } });

      if (exists) {
        throw new trpc.TRPCError({
          code: "CONFLICT",
          message: ERROR_MESSAGE.DuplicateClient,
        });
      }

      await ctx.prisma.labeledFaceDescriptor.create({
        data: {
          ci,
          data: labeledFaceDescriptorJson,
        },
      });

      const updatedBy = ctx.session?.user?.name || "Unknown User"; // Safely extract the user's name or default to 'Unknown User'

      // Modificación para agregar el campo password como null
      const client = await ctx.prisma.user.create({
        data: {
          ci,
          name,
          phoneNumber,
          updatedBy,
          email,
          password: null, // Se establece password como null por defecto
        },
      });

      return client;
    },
  })

  /////
  .mutation("assignPlan", {
    input: assignPlanSchema,
    async resolve({ input, ctx }) {
      const {
        ci,
        name,
        startingDate,
        endingDate,
        parking,
        groupClasses,
        paymentDate,
        paymentType,
      } = input;

      // Find the user by CI
      const user = await ctx.prisma.user.findFirst({ where: { ci } });
      if (!user) {
        throw new trpc.TRPCError({
          code: "NOT_FOUND",
          message: ERROR_MESSAGE.ClientNotFound,
        });
      }

      // Find the plan by name
      const plan = await ctx.prisma.plan.findFirst({ where: { name } });
      if (!plan) {
        throw new trpc.TRPCError({
          code: "NOT_FOUND",
          message: ERROR_MESSAGE.PlanNotFound,
        });
      }

      // Safely extract the user's name from session data or default to 'Unknown User'
      const updatedBy = ctx.session?.user?.name || "Unknown User";

      // Create the user plan
      const userPlan = await ctx.prisma.userPlan.create({
        data: {
          userId: user.id,
          planId: plan.id,
          startingDate,
          endingDate,
          updatedBy,
          parking,
          groupClasses,
          paymentDate,
          paymentType,
        },
      });

      return userPlan;
    },
  });
