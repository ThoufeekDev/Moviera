

export const ShowStatus = {
DRAFT :'DRAFT',
  PUBLISHED : 'PUBLISHED',
  CANCELLED : 'CANCELLED',
} as const



export type ShowStatus = (typeof ShowStatus)[keyof typeof ShowStatus]