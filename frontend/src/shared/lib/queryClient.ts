import { QueryClient } from '@tanstack/react-query';
import { ApiError } from './ApiError';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (count, e) =>
        !(e instanceof ApiError && e.statusCode >= 400 && e.statusCode < 500) && count < 2,
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 5000),
    },
    mutations: {
      retry: false,
    },
  },
});

export default queryClient;