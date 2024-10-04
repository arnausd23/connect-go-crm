import { z } from "zod";
import { ERROR_MESSAGE, PLAN_ACCESS_TYPE } from "../../../utils/constants";

export const authSchema = z.object({
  username: z.string(),
  password: z.string(),
});

export const createClientSchema = z.object({
  ci: z.string().trim().min(5, { message: ERROR_MESSAGE.InvalidCI }),
  name: z.string().trim().min(1, { message: ERROR_MESSAGE.EmptyName }),
  phoneNumber: z.string(),
  email: z.string(),
  photoSrc: z.string().trim().optional(),
  photoTaken: z.boolean().optional(),
  labeledFaceDescriptorJson: z.any(),
});

export const createPlanSchema = z.object({
  accessType: z
    .enum([
      PLAN_ACCESS_TYPE.Unlimited,
      PLAN_ACCESS_TYPE.OneSession,
      PLAN_ACCESS_TYPE.ThreePerWeek,
    ])
    .refine((val) => val !== undefined, {
      message: "Tipo de acceso es requerido",
    }),
  name: z.string().trim().min(1, { message: "El nombre es requerido" }),
  price: z.string().min(1, { message: "El precio es requerido" }),
  hasHourRestriction: z.boolean().refine((val) => val !== undefined, {
    message: "Restricción horaria es requerida",
  }),
  restrictionHours: z
    .array(z.number())
    .length(2, { message: "Las horas de restricción deben ser dos números" }),
  disp: z.enum(["Go", "Connect", "Ambos"], {
    message: "Debes seleccionar un gimnasio",
  }), // Mensaje de error para disp
});

export const assignPlanSchema = z.object({
  ci: z.string().trim().min(5, { message: ERROR_MESSAGE.InvalidCI }),
  endingDate: z.date(),
  name: z.string().trim().min(1, { message: ERROR_MESSAGE.EmptyName }),
  startingDate: z.date(),
  parking: z.boolean(),
  groupClasses: z.boolean(),
  paymentDate: z.date(),
  paymentType: z.string(),
});

export const createAccessHistorySchema = z.object({
  ci: z.string(),
  date: z.date(),
});

export const paginationSchema = z.object({
  skip: z.number().optional(),
  take: z.number().optional(),
});

export const getUserPlansSchema = z.object({
  skip: z.number().optional(),
  take: z.number().optional(),
  userName: z.string().optional(),
  planName: z.string().optional(),
  startingDate: z.date().optional(),
  endingDate: z.date().optional(),
});

export const getClientsSchema = z.object({
  skip: z.number().optional(),
  take: z.number().optional(),
  name: z.string().optional(),
  ci: z.string().optional(),
});

export const editUserPlanSchema = z.object({
  id: z.string(),
  startingDate: z.date(),
  endingDate: z.date(),
  parking: z.boolean(),
  groupClasses: z.boolean(),
  freezedDays: z.string(),
  freezedStartingDate: z.date(),
  additionalInfo: z.string(),
});

export const editClientSchema = z.object({
  id: z.string(),
  name: z.string().trim().min(1, { message: ERROR_MESSAGE.EmptyName }),
  ci: z.string().trim().min(1, { message: ERROR_MESSAGE.EmptyCI }), // Added ci field
  phoneNumber: z.string(),
  email: z.string(),
  photoSrc: z.string().trim().min(1, { message: ERROR_MESSAGE.EmptyPhoto }),
  photoTaken: z.boolean().optional(),
  labeledFaceDescriptor: z.any(),
  editPhoto: z.boolean(),
});

export const editPlanSchema = z.object({
  id: z.string(),
  name: z.string().trim().min(1, { message: ERROR_MESSAGE.EmptyName }),
  accessType: z.enum([
    PLAN_ACCESS_TYPE.Unlimited,
    PLAN_ACCESS_TYPE.OneSession,
    PLAN_ACCESS_TYPE.ThreePerWeek,
  ]),
  price: z.string(),
  hasHourRestriction: z.boolean(),
  restrictionHours: z.array(z.number()).length(2),
  disp: z.enum(["Go", "Connect", "Ambos"]), // Añadir el campo disp con opciones de gimnasios
});

export const deleteSchema = z.object({
  id: z.string(),
  ci: z.string().optional(),
});

export const updatePasswordSchema = z.object({
  newPassword: z
    .string()
    .trim()
    .min(8, { message: ERROR_MESSAGE.InvalidPassword }),
  repeatedNewPassword: z
    .string()
    .trim()
    .min(8, { message: ERROR_MESSAGE.InvalidPassword }),
});

export const exportSchema = z.object({
  fileName: z.string().trim().min(1, { message: ERROR_MESSAGE.EmptyName }),
});

export const exportUserPlansSchema = z.object({
  fileName: z.string().trim().min(1, { message: ERROR_MESSAGE.EmptyName }),
  userName: z.string().optional(),
  planName: z.string().optional(),
  startingDate: z.date().optional(),
  endingDate: z.date().optional(),
});

export const exportAccessHistorySchema = z.object({
  fileName: z.string().trim().min(1, { message: ERROR_MESSAGE.EmptyName }),
  userName: z.string().optional(),
  planName: z.string().optional(),
  startingDate: z.date().optional(),
  endingDate: z.date().optional(),
});

export type IAuth = z.infer<typeof authSchema>;
export type ICreateClient = z.infer<typeof createClientSchema>;
export type ICreatePlan = z.infer<typeof createPlanSchema>;
export type IAssignPlan = z.infer<typeof assignPlanSchema>;
export type ICreateAccessHistory = z.infer<typeof createAccessHistorySchema>;
export type IEditUserPlan = z.infer<typeof editUserPlanSchema>;
export type IEditPlan = z.infer<typeof editPlanSchema>;
export type IEditClient = z.infer<typeof editClientSchema>;
export type IUpdatePassword = z.infer<typeof updatePasswordSchema>;
export type IExport = z.infer<typeof exportSchema>;
export type IExportUserPlans = z.infer<typeof exportUserPlansSchema>;
export type IExportAccessHistory = z.infer<typeof exportAccessHistorySchema>;
export type IGetUserPlans = z.infer<typeof getUserPlansSchema>;
export type IGetClients = z.infer<typeof getClientsSchema>;
