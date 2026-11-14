import type { GetShowsParams } from './types/show.types';

export const showKeys = {
  all: ['shows'] as const,
  lists: () => [...showKeys.all, 'list'] as const,
  list: (params: GetShowsParams = {}) => [...showKeys.lists(), params] as const,
  details: () => [...showKeys.all, 'detail'] as const,
  detail: (showId: string) => [...showKeys.details(), showId] as const,
};

