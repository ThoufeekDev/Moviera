import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate } from 'react-router-dom';

import { useAuthStore } from '../../../auth/stores/auth.store';
import { loginSchema, type LoginFormData } from '../../../auth/validators/login.schema';

import { getErrorMessage } from '@/shared/utils/getErrorMessage';
import { MovieraLogo } from '@/shared/ui/MovieraLogo';
import { Input } from '@/shared/ui/Input';
import { Button } from '@/shared/ui/Button';
import { Role } from '@/shared/constants/Role';

export default function TheatreAdminLoginPage() {
  const navigate = useNavigate();
  const [authError, setAuthError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const login = useAuthStore((state) => state.login);
  const { isLoading } = useAuthStore();

  const onSubmit = async (data: LoginFormData) => {
    try {
      setAuthError('');

      await login({
        ...data,
        role: Role.THEATRE_ADMIN,
      });

      navigate('/theatre-admin');
    } catch (error: unknown) {
      setAuthError(getErrorMessage(error));
    }
  };

  return (
    <div className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-slate-50 p-4 font-sans bg-[radial-gradient(circle_at_50%_0%,rgba(248,68,100,0.06)_0%,rgba(248,250,252,1)_75%)]">
      <main className="relative z-10 w-full max-w-[440px] max-h-[calc(100vh-2rem)] overflow-y-auto rounded-3xl border border-slate-200/80 border-t-4 border-t-brand-500 bg-white p-7 sm:p-9 shadow-xl shadow-slate-900/5 animate-in fade-in zoom-in-95 duration-200">
        <header className="mb-6 flex flex-col items-center text-center">
          <MovieraLogo size="md" subtitle="" />
          <h1 className="mt-4 text-2xl font-extrabold tracking-tight text-slate-900">
            Admin Login
          </h1>
        </header>

        {authError && (
          <div
            className="mb-5 flex items-center gap-2.5 rounded-xl border border-rose-200 bg-rose-50 px-3.5 py-2.5 text-left text-xs font-medium text-rose-800"
            role="alert"
          >
            <svg
              className="h-4 w-4 shrink-0 text-rose-600"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            <span className="leading-relaxed">{authError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-4">
          <Input
            id="admin-email"
            type="email"
            autoComplete="email"
            label="Email"
            placeholder="admin@moviera.com"
            error={errors.email?.message}
            {...register('email')}
          />

          <Input
            id="admin-password"
            type="password"
            autoComplete="current-password"
            label="Password"
            placeholder="Enter your password"
            error={errors.password?.message}
            {...register('password')}
          />

          <Button
            type="submit"
            fullWidth
            size="lg"
            loading={isLoading}
            className="mt-2 font-bold shadow-lg shadow-brand-500/25"
          >
            Sign in
          </Button>
        </form>

        <footer className="mt-6 text-center text-xs text-slate-500">
          Need an account?{' '}
          <Link to="/register" className="font-semibold text-brand-500 hover:text-brand-600 hover:underline">
            Register Here
          </Link>
        </footer>
      </main>
    </div>
  );
}
