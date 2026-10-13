export const theatreKeys = {
  all: ['theatres'] as const,
  myTheatres: () => [...theatreKeys.all, 'my-theatres'] as const,
  overview: (theatreId: string) => [...theatreKeys.all, 'overview', theatreId] as const,
  forAdmin: (query?: {
    search?: string;
    city?: string;
    status?: 'ALL' | 'ASSIGNED' | 'UNASSIGNED';
  }) => [...theatreKeys.all, 'for-admin', query] as const,
  adminStats: () => [...theatreKeys.all, 'admin-stats'] as const,
  eligibleAdmins: (search?: string) => [...theatreKeys.all, 'eligible-admins', search] as const,
  assignments: (query?: unknown) => [...theatreKeys.all, 'assignments', query] as const,
};
