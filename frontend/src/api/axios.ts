import axios from 'axios';
import { refreshAccessToken } from '../features/auth/services/auth.service';
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,

  withCredentials: true,
});

// ========================================
// REFRESH TOKEN LOCK
// ========================================

let isRefreshing = false;

// ========================================
// FAILED REQUEST QUEUE TYPE
// ========================================

type FailedQueueItem = {
  resolve: () => void;

  reject: (reason?: unknown) => void;
};

// ========================================
// FAILED REQUEST QUEUE
// ========================================

let failedQueue: FailedQueueItem[] = [];

// ========================================
// PROCESS WAITING REQUESTS
// ========================================

const processQueue = (error: unknown = null) => {
  failedQueue.forEach((promise) => {
    if (error) {
      promise.reject(error);
    } else {
      promise.resolve();
    }
  });

  failedQueue = [];
};

// ========================================
// RESPONSE INTERCEPTOR
// ========================================

api.interceptors.response.use(
  // SUCCESS RESPONSE

  (response) => response,

  // ERROR RESPONSE

  async (error) => {
    const originalRequest = error.config as typeof error.config & {
      _retry?: boolean;
    };

    // ====================================
    // ACCESS TOKEN EXPIRED
    // ====================================

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      originalRequest.url !== '/auth/refresh-token'
    ) {
      // ==================================
      // PREVENT INFINITE RETRY LOOP
      // ==================================

      originalRequest._retry = true;

      // ==================================
      // IF REFRESH ALREADY RUNNING
      // ==================================

      if (isRefreshing) {
        return new Promise<void>((resolve, reject) => {
          failedQueue.push({
            resolve,
            reject,
          });
        }).then(() => {
          return api(originalRequest);
        });
      }

      // ==================================
      // START REFRESH PROCESS
      // ==================================

      isRefreshing = true;

      try {
        // ================================
        // REQUEST NEW ACCESS TOKEN
        // ================================

        // await api.post('/auth/refresh-token');
        await refreshAccessToken()

        // ================================
        // RETRY WAITING REQUESTS
        // ================================

        processQueue();

        // ================================
        // RETRY ORIGINAL REQUEST
        // ================================

        return api(originalRequest);
      } catch (refreshError) {
        // ================================
        // REJECT WAITING REQUESTS
        // ================================

        processQueue(refreshError);

        console.log('Refresh token expired');

        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  },
);

export default api;
