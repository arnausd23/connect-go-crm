export const NAV_BAR_WIDTH: number = 320;
export const FACE_MATCH_DISTANCE_THRESHOLD: number = 0.45;
export const MINUTES_BETWEEN_ACCESS: number = 1;

export const enum SECTION {
  AccessControl = 'Control de acceso',
  Plans = 'Planes',
}
export const enum ACCESS_CONTROL_TAB_LABEL {
  ClientAuthentication = 'Autenticación de clientes',
  AccessHistory = 'Historial de accesos',
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
  DuplicateClient = 'Ya existe un cliente con ese CI.',
  EmptyName = 'Porfavor ingresa un nombre.',
  EmptyPhoto = 'Porfavor toma una foto.',
  FailedToLoadModels = 'Error al cargar los modelos.',
  FailedToSavePhoto = 'Error al guardar la foto, porfavor intenta de nuevo.',
  InvalidCI = 'Porfavor ingresa un carnet válido.',
  InvalidCredentials = 'Credenciales inválidos.',
  PlanNotFound = 'Plan no encontrado.',
  SomethingWentWrong = 'Algo salió mal.',
  UserNotFound = 'Usuario no encontrado.',
}

export const enum SUCCESS_MESSAGE {
  ClientCreated = 'Cliente creado exitosamente.',
  PlanAssigned = 'Plan asignado exitosamente.',
  PlanCreated = 'Plan creado exitosamente.',
}

export const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

export type AccessAuthenticationInfo = {
  bgColor: string;
  endingDate: Date | undefined;
  footer: string | undefined;
  header: string | undefined;
  name: string | undefined;
  startingDate: Date | undefined;
};
