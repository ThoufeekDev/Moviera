  export const status = {
    ALL: "ALL",
    ASSIGNED: "ASSIGNED",
    UNASSIGNED: "UNASSIGNED",
} as const

export type status = (typeof status)[keyof typeof status];
