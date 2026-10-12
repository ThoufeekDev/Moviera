import { create } from 'zustand';

import {
  loginUser,
  logoutUser,
  getProfile,
  registerUser,
  verifyOtpPayload,
  resendOtp,
  googleLogin
} from '../api/auth.api';

import type { User } from '../types/auth.types';

import type { LoginDTO } from '../types/dto/Login.dto';
import type { RegisterDTO } from '../types/dto/Register.dto';
import type { VerifyOtpDTO } from '../types/dto/VerifyOtp.dto';
import type { ResendOtp } from '../types/dto/ResendOtp.dto';
import type { ResendOtpResponse } from '../types/dto/ResendOtpResponse.dto';

interface AuthStore {
  user: User | null;

  isAuthenticated: boolean;
  isCheckingAuth: boolean;
  isLoading: boolean;

  register: (data: RegisterDTO) => Promise<void>;

  login: (data: LoginDTO) => Promise<void>;

  logout: () => Promise<void>;

  clear: () => void;

  fetchProfile: () => Promise<void>;

  verifyOtpAndLogin: (data: VerifyOtpDTO) => Promise<void>;

  resendOtp: (data: ResendOtp) => Promise<ResendOtpResponse>;
  
  googleLogin: (credential: string) => Promise<void>;
}

export const useAuthStore = create<AuthStore>((set, get) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  isCheckingAuth: true,

  clear: () => {
    set({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      isCheckingAuth: false,
    });
  },

  register: async (data) => {
    try {
      set({
        isLoading: true,
      });

      await registerUser(data);
    } catch (error) {
      console.error('error is ', error);
      throw error;
    } finally {
      set({
        isLoading: false,
      });
    }
  },

  login: async (data) => {
    try {
      set({
        isLoading: true,
      });
      const user = await loginUser(data);

      set({
        user,
        isAuthenticated: true,
      });
    } catch (error) {
      console.error(error);
      throw error;
    } finally {
      set({
        isLoading: false,
      });
    }
  },

  googleLogin: async (credential) => {
    try {
      set({
        isLoading: true,
      });

      await googleLogin(credential);
      const profile = await getProfile();
      set({
        user: profile,
        isAuthenticated: true,
      });
    } catch (error) {
      console.error(error);
      throw error;
    } finally {
      set({
        isLoading: false,
      });
    }
  },

  logout: async () => {
    try {
      await logoutUser();
    } catch (error) {
      console.error(error);
    } finally {
      set({
        user: null,
        isAuthenticated: false,
      });
    }
  },

  fetchProfile: async () => {
    try {
      set({
        isLoading: true,
      });

      const profile = await getProfile();

      set({
        user: profile,
        isAuthenticated: true,
      });
    } catch {
      set({
        user: null,
        isAuthenticated: false,
      });
    } finally {
      set({
        isLoading: false,
        isCheckingAuth: false,
      });
    }
  },

  verifyOtpAndLogin: async (data) => {
    try {
      set({
        isLoading: true,
      });
      await verifyOtpPayload(data);
      await get().fetchProfile();
    } catch (error) {
      console.error(error);
      throw error;
    } finally {
      set({
        isLoading: false,
      });
    }
  },

  resendOtp: async (data) => {
    try {
      return await resendOtp(data);
    } catch (error) {
      console.error(error);
      throw error;
    }
  },
}));
