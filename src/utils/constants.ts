export const NAV_BAR_WIDTH: number = 320;

export const enum SECTIONS {
  AccessControl = 'Control de acceso',
  Plans = 'Planes',
}
export const enum ACCESS_CONTROL_TAB_LABELS {
  ClientAuthentication = 'Autenticación de clientes',
  AccessHistory = 'Historial de accesos',
}

export const enum NAVBAR_ACTION_BAR_BUTTON_LABELS {
  AssignPlan = 'Asignar plan',
  CreateClient = 'Nuevo cliente',
  CreatePlan = 'Nuevo plan',
  Settings = 'Configuración',
  SignOut = 'Cerrar sesión',
}

export const enum PLANS {
  Everyday = 'Todos los días',
  OneSession = 'Una sesión',
  ThreePerWeek = '3 por semana',
}

export const enum ERROR_MESSAGES {
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

export const enum SUCCESS_MESSAGES {
  ClientCreated = 'Cliente creado exitosamente.',
  PlanAssigned = 'Plan asignado exitosamente.',
  PlanCreated = 'Plan creado exitosamente.',
}
