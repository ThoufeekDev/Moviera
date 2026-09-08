
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import Button from '../../../../shared/components/Button/Button';
import Input from '../../../../shared/components/Input/Input';
import AuthBrandHeader from '../../../auth/components/AuthBrandHeader';
import { useAuthStore } from '../../../auth/store/auth.store';
import { useState } from 'react';
import { Role } from '../../../../shared/enums/Role';
import { getErrorMessage } from '../../../../shared/utils/getErrorMessage';
import AuthErrorBanner from '../../../auth/components/AuthErrorBanner';
import {
  superAdminLoginSchema,
  type SuperAdminLoginFormData,
} from '../../validators/superAdminLogin.schema';

import './SuperAdminLoginPage.module.css';

export default function SuperAdminLoginPage() {
    const { login, isLoading } = useAuthStore();
    const [authError, setAuthError] = useState('');
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SuperAdminLoginFormData>({
    resolver: zodResolver(superAdminLoginSchema),
  });

    const onSubmit = async (data: SuperAdminLoginFormData) => {
       setAuthError('');
      try {
       
      await login({
        email: data.email,
        password: data.password,
        role: Role.SUPER_ADMIN,
      });

      navigate('/super-admin', { replace: true });
      } catch (error) {
       setAuthError(getErrorMessage(error));
      console.error('Login error:', error);
    }
  };

  return (
    <div className="login-container">
      <main className="login-card">
        <div style={{ textAlign: 'center' }}>
          <span className="card-cinema-badge">
            <span className="badge-dot"></span>
            Super Admin Portal
          </span>
        </div>

        <AuthBrandHeader
          title="Welcome Back, Owner"
          description="Login to access system control & owner administrative portal"
              />
              
               {authError && <AuthErrorBanner message={authError} />}

        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <Input
            id="super-admin-email"
            type="email"
            label="Email Address"
            placeholder="admin@moviera.com"
            autoComplete="email"
            {...register('email')}
            error={errors.email?.message}
          />

          <Input
            id="super-admin-password"
            type="password"
            label="Password"
            placeholder="••••••••"
            autoComplete="current-password"
            {...register('password')}
            error={errors.password?.message}
          />

          <div className="form-actions">
            <label className="remember-me">
              <input
                type="checkbox"
                id="remember-me-check"
              />
              Remember me
            </label>
          </div>

          <Button
            type="submit"
            className="submit-btn"
            loading={isLoading}
          >
            Login
          </Button>
        </form>
      </main>
    </div>
  );
}

