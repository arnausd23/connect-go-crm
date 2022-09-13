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
  DuplicateClient = 'Ya existe un cliente con ese CI.',
  EmptyName = 'Porfavor ingresa un nombre.',
  InvalidCredentials = 'Credenciales inválidos.',
  NotFound = 'Usuario no encontrado.',
  SomethingWentWrong = 'Algo salió mal.',
}

export const enum SUCCESS_MESSAGES {
  ClientCreated = 'Cliente creado exitosamente.',
  PlanCreated = 'Plan creado exitosamente.',
}
