export const NAV_BAR_WIDTH = 320;
export const FACE_MATCH_DISTANCE_THRESHOLD = 0.45;
export const MINUTES_BETWEEN_ACCESS = 1;
export const TABLE_PAGE_SIZE = 10;

export const enum SECTION {
  AccessControl = 'Control de acceso',
  Plans = 'Planes',
  Clients = 'Clientes',
}
export const enum CUSTOM_TAB_LABEL {
  ClientAuthentication = 'Autenticación de clientes',
  AccessHistory = 'Historial de accesos',
  CreatedPlans = 'Planes creados',
  UserPlans = 'Planes de clientes',
  Clients = 'Clientes',
}

export const enum NAVBAR_ACTION_BAR_BUTTON_LABEL {
  AssignPlan = 'Asignar plan',
  CreateClient = 'Nuevo cliente',
  CreatePlan = 'Nuevo plan',
  Settings = 'Configuración',
  SignOut = 'Cerrar sesión',
}

export const enum PLAN_ACCESS_TYPE {
  Unlimited = 'Ilimitado',
  OneSession = 'Una sesión',
  ThreePerWeek = '3 por semana',
}

export const enum ERROR_MESSAGE {
  ClientNotFound = 'Cliente no encontrado.',
  DuplicateUser = 'Ya existe ese usuario.',
  DuplicateClient = 'Ya existe un cliente con ese CI.',
  DuplicatePlan = 'Ya existe un plan con ese nombre.',
  EmptyName = 'Porfavor ingresa un nombre.',
  EmptyPhoto = 'Porfavor toma una foto.',
  FailedToLoadModels = 'Error al cargar los modelos.',
  FailedToSavePhoto = 'Error al guardar la foto, porfavor intenta de nuevo.',
  InvalidCI = 'Porfavor ingresa un carnet válido.',
  InvalidCredentials = 'Credenciales inválidos.',
  InvalidPassword = 'La contraseña debe contener al menos 8 caracteres.',
  PlanNotFound = 'Plan no encontrado.',
  SomethingWentWrong = 'Algo salió mal.',
  UserNotFound = 'Usuario no encontrado.',
  PasswordMismatch = 'Las contraseñas no coinciden.',
}

export const enum SUCCESS_MESSAGE {
  ClientCreated = 'Cliente creado exitosamente.',
  ClientUpdated = 'Cliente actualizado exitosamente.',
  ClientDeleted = 'Cliente eliminado exitosamente.',
  PlanAssigned = 'Plan asignado exitosamente.',
  PlanCreated = 'Plan creado exitosamente.',
  PlanDeleted = 'Plan eliminado exitosamente.',
  PlanUpdated = 'Plan actualizado exitosamente.',
  UserPlanDeleted = 'Plan de cliente eliminado exitosamente.',
  UserPlanUpdated = 'Plan de cliente actualizado exitosamente.',
  PasswordUpdated = 'Contraseña actualizada exitosamente,',
}

export const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

export type ClientAuthenticationInfo = {
  bgColor: string;
  endingDate: Date | undefined;
  footer: string | undefined;
  header: string | undefined;
  name: string | undefined;
  startingDate: Date | undefined;
};

export type AccessHistoryTableInfo = {
  userPlan: {
    user: {
      name: string;
    };
    endingDate: Date;
    plan: {
      name: string;
    };
  };
  date: Date;
};

export type UserPlansTableInfo = {
  id: string;
  endingDate: Date;
  startingDate: Date;
  updatedBy: string;
  user: {
    name: string;
  };
  plan: {
    name: string;
  };
};

export type ClientsTableInfo = {
  ci: string;
  id: string;
  name: string;
  updatedBy: string;
  phoneNumber: string | null;
};
