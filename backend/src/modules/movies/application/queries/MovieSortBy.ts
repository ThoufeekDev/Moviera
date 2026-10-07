export const MovieSortBy = {
  TITLE: 'title',
  RELEASE_DATE: 'releaseDate',
  CREATED_AT: 'createdAt',
  UPDATED_AT: 'updatedAt',
} as const;

export type MovieSortBy =
  (typeof MovieSortBy)[keyof typeof MovieSortBy];