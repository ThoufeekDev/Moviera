import { QueryClient } from '@tanstack/react-query';

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
         retry:(failureCount, error: any) =>{
                const status = error?.response?.status;

                // Don't retry client-side errors
                if (status >= 400 && status < 500) {
                    return false;
                }
                 
                // Retry server/network errors up to 2 times
                return failureCount < 2;
            },
            retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 5000),
        },
        mutations: {
            // Don't automatically retry mutations
            retry:false
        }
    }
});

export default queryClient;