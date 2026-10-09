import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';

import { Button } from '@/shared/ui/Button';
import { Input } from '@/shared/ui/Input';
import AuthBrandHeader from '../../../auth/components/AuthBrandHeader';
import AuthErrorBanner from '../../../auth/components/AuthErrorBanner';
import { useAuthStore } from '../../../auth/stores/auth.store';
import { Role } from '@/shared/constants/Role';
import { getErrorMessage } from '@/shared/utils/getErrorMessage';
import {
  superAdminLoginSchema,
  type SuperAdminLoginFormData,
} from './validators/superAdminLogin.schema';

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
    <div className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-slate-50 p-4 font-sans bg-[radial-gradient(circle_at_50%_0%,rgba(248,68,100,0.06)_0%,rgba(248,250,252,1)_75%)]">
      <main className="relative z-10 w-full max-w-[440px] max-h-[calc(100vh-2rem)] overflow-y-auto rounded-3xl border border-slate-200/80 border-t-4 border-t-brand-500 bg-white p-7 sm:p-9 shadow-xl shadow-slate-900/5 animate-in fade-in zoom-in-95 duration-200">
        <div className="text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-brand-500/20 bg-brand-500/10 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-brand-500 mb-4">
            <span className="h-1.5 w-1.5 rounded-full bg-brand-500 shadow-[0_0_8px_rgba(248,68,100,0.8)]" />
            Super Admin Portal
          </span>
        </div>

        <AuthBrandHeader
          title="Welcome Back, Owner"
          description="Login to access system control & owner administrative portal"
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

          <div className="my-1 flex items-center justify-between text-xs">
            <label className="inline-flex cursor-pointer select-none items-center gap-2 font-medium text-slate-600">
              <input
                type="checkbox"
                id="remember-me-check"
                className="h-4 w-4 rounded border-slate-300 text-brand-500 accent-brand-500 focus:ring-brand-500"
              />
              Remember me
            </label>
          </div>

          <Button
            type="submit"
            fullWidth
            size="lg"
            className="mt-1 font-bold shadow-lg shadow-brand-500/25"
            loading={isLoading}
          >
            Login
          </Button>
        </form>
      </main>
    </div>
  );
}
