import api from '../../../api/axios';


import type { LoginDTO } from '../types/dto/Login.dto';
import type { RegisterDTO } from '../types/dto/Register.dto';
import type { VerifyOtpDTO } from '../types/dto/VerifyOtp.dto';
import type { ResendOtp } from '../types/dto/ResendOtp.dto';
export const registerUser = async (data: RegisterDTO) => {
  const response = await api.post('/auth/register', data);

  return response.data.data
};

export const verifyOtpPaylod = async (data: VerifyOtpDTO) => {
  const response = await api.post('/auth/verify-otp', data);
  return response.data.data;
};

export const loginUser = async (data: LoginDTO) => {

        const response = await api.post('/auth/login', data);

        return response.data.data;
  

  // return response.data.user
};

export const logoutUser = async () => {
  const response = await api.post('/auth/logout');
  return response.data;
};

export const getProfile = async () => {
  const response = await api.get('/auth/profile');

  // return response.data;
  return response.data.data;
};

export const refreshAccessToken = async () => {
  console.log('refreshAccessToken triggered');
  
await api.post('/auth/refresh-token');
  
};


export const resendOtp = async (data: ResendOtp) => {
  const response = await api.post('/auth/resend-otp',data);

  return response.data;
}


export const googleLogin = async (credential:string) => {
  const response = await api.post('/auth/google',{credential})
 
  return response.data.data;
}