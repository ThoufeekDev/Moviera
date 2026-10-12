import axios from 'axios';
import env from './env';
import { normalizeApiError } from './normalizeApiError';

const api = axios.create({
  baseURL: env.apiBaseUrl,
  withCredentials: true,
});

const bareAxios = axios.create({
  baseURL: env.apiBaseUrl,
  withCredentials: true,
});

type AuthFailureHandler = () => void;
let authFailureHandler: AuthFailureHandler | null = null;

export const setAuthFailureHandler = (handler: AuthFailureHandler) => {
  authFailureHandler = handler;
};

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
  (response) => response,

  async (error) => {
    const originalRequest = error.config as typeof error.config & {
      _retry?: boolean;
    };

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      originalRequest.url !== '/auth/refresh-token' &&
      originalRequest.url !== '/auth/login'
    ) {
      originalRequest._retry = true;

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

      isRefreshing = true;

      try {
        await bareAxios.post('/auth/refresh-token');
        processQueue();
        return api(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError);
        if (authFailureHandler) {
          authFailureHandler();
        }
        return Promise.reject(normalizeApiError(refreshError));
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(normalizeApiError(error));
  },
);

export default api;
