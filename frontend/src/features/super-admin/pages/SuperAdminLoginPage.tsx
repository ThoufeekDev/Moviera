import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';

import { Button } from '@/shared/ui/Button';
import { Input } from '@/shared/ui/Input';
import { AuthBrandHeader, AuthErrorBanner, useAuthStore } from '@/features/auth';
import { Role } from '@/shared/constants/Role';
import { getErrorMessage } from '@/shared/lib/getErrorMessage';
import {
  superAdminLoginSchema,
  type SuperAdminLoginFormData,
} from '../schemas/superAdminLogin.schema';

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
    <div className="min-h-dvh flex w-full items-center justify-center bg-page p-4 font-sans text-ink">
      <main className="w-full max-w-[28rem] rounded-lg border border-border bg-surface p-6 sm:p-8 shadow-card">
        <AuthBrandHeader
          title="Super Admin Portal"
          description="Login to access platform administration and master catalogs"
        />

        {authError && <AuthErrorBanner message={authError} />}

        <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-4">
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

          <div className="my-1 flex items-center justify-between text-xs md:text-sm">
            <label className="inline-flex cursor-pointer select-none items-center gap-2 font-normal text-ink">
              <input
                type="checkbox"
                id="remember-me-check"
                className="h-4 w-4 rounded-sm border-border accent-brand-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-600"
              />
              Remember me
            </label>
          </div>

          <Button
            type="submit"
            fullWidth
            size="md"
            className="mt-1"
            loading={isLoading}
          >
            Sign In
          </Button>
        </form>
      </main>
    </div>
  );
}
