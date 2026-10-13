export const TheatreAdminAssignmentRole = {
  PRIMARY_MANAGER: 'PRIMARY_MANAGER',
  OPERATIONS_SUPERVISOR: 'OPERATIONS_SUPERVISOR',
  BOX_OFFICE_LEAD: 'BOX_OFFICE_LEAD',
} as const;

export type TheatreAdminAssignmentRole =
  (typeof TheatreAdminAssignmentRole)[keyof typeof TheatreAdminAssignmentRole];