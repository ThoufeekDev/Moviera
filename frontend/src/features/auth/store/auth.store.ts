import { create } from 'zustand';

import {
  loginUser,
  logoutUser,
  getProfile,
  registerUser,
  verifyOtpPaylod,
  resendOtp,
  googleLogin
} from '../services/auth.service';

import type { LoginDTO } from '../dtos/login.dto';
import type { User } from '../types/auth.types';
import type { RegisterDTO } from '../dtos/register.dto';
import type { VerifyOtpDTO } from '../dtos/verify-otp.dto';
import type { ResendOtp } from '../dtos/resent_otp.dto';
import type { ResendOtpResponse } from '../dtos/resentOtpResponse.dto';

interface AuthStore {
  user: User | null;

  isAuthenticated: boolean;
  isCheckingAuth: boolean;
  isLoading: boolean;

  register: (data: RegisterDTO) => Promise<void>;

  login: (data: LoginDTO) => Promise<void>;

  logout: () => Promise<void>;

  fetchProfile: () => Promise<void>;

  verifyOtpAndLogin: (data: VerifyOtpDTO) => Promise<void>;

  resendOtp: (data: ResendOtp) => Promise<ResendOtpResponse>;
  
  googleLogin: (credential:string)=> Promise<void>;
}

export const useAuthStore = create<AuthStore>((set, get) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  isCheckingAuth: true,

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
      await loginUser(data);

      const profile = await getProfile();

      set({
        //user:profile.user
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

  googleLogin: async (credential) => {
    try {
      set({
        isLoading:true,
      })

      await googleLogin(credential);
      const profile = await getProfile();
      set({
        user: profile,
        isAuthenticated:true
      })
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
      set({
        user: null,
        isAuthenticated: false,
      });
    } catch (error) {
      console.error(error);
      throw error;
    }
  },

  // logout: async () => {
  //   try {
  //     await logoutUser();
  //   } catch (error) {
  //     console.error('Logout request failed:', error);
  //   } finally {
  //     useHospitalStore.getState().resetHospital();

  //     set({
  //       user: null,
  //       isAuthenticated: false,
  //     });
  //   }
  // },

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
    } catch (error) {
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
      await verifyOtpPaylod(data);
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

  resendOtp: async (data)=>{
    try {

      return await resendOtp(data)
      
    } catch (error) {
      
    }
  }
}));
