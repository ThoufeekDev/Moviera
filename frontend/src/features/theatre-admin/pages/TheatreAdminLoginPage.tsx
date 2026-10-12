import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate } from 'react-router-dom';

import { useAuthStore, loginSchema, type LoginFormData } from '@/features/auth';
import { getErrorMessage } from '@/shared/lib/getErrorMessage';
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
    <div className="min-h-dvh flex w-full items-center justify-center bg-page p-4 font-sans text-ink">
      <main className="w-full max-w-[28rem] rounded-lg border border-border bg-surface p-6 sm:p-8 shadow-card">
        <header className="mb-6 flex flex-col items-center text-center">
          <MovieraLogo size="md" subtitle="Partner Portal" />
          <h1 className="mt-4 text-xl md:text-2xl font-bold tracking-tight text-ink">
            Theatre Partner Login
          </h1>
          <p className="mt-1 text-xs md:text-sm text-ink-muted">
            Manage your screens, schedules, and ticket operations
          </p>
        </header>

        {authError && (
          <div
            className="mb-5 flex items-center gap-2 rounded-md border border-brand-100 bg-brand-50 px-3.5 py-2.5 text-left text-xs md:text-sm font-medium text-danger-600"
            role="alert"
          >
            <svg
              className="h-4 w-4 shrink-0 text-danger-600"
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
            <span className="leading-snug">{authError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-4">
          <Input
            id="admin-email"
            type="email"
            autoComplete="email"
            label="Email Address"
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
            size="md"
            loading={isLoading}
            className="mt-2"
          >
            Sign In
          </Button>
        </form>

        <footer className="mt-6 text-center text-xs md:text-sm text-ink-muted">
          Need an account?{' '}
          <Link to="/theatre-admin/register" className="font-medium text-brand-600 hover:underline">
            Register Here
          </Link>
        </footer>
      </main>
    </div>
  );
}
