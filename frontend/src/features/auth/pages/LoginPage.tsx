import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/auth.store';
import { useState } from 'react';
import { getErrorMessage } from '@/shared/lib/getErrorMessage';
import { loginSchema, type LoginFormData } from '../schemas/login.schema';

// UI Kit Components
import { Button } from '@/shared/ui/Button';
import { Input } from '@/shared/ui/Input';
import AuthBrandHeader from '../components/AuthBrandHeader';
import SocialLoginButtons from '../components/SocialLoginButtons';
import AuthDivider from '../components/AuthDivider';
import AuthErrorBanner from '../components/AuthErrorBanner';

export default function LoginPage() {
  const { login, isLoading } = useAuthStore();
  const navigate = useNavigate();
  const [authError, setAuthError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      setAuthError('');

      await login({
        ...data,
        role: 'USER',
      });

      navigate('/', { replace: true });
    } catch (error) {
      setAuthError(getErrorMessage(error));
    }
  };

  return (
    <div className="min-h-dvh flex w-full items-center justify-center bg-page p-4 font-sans text-ink">
      <main className="w-full max-w-[28rem] rounded-lg border border-border bg-surface p-6 sm:p-8 shadow-card">
        <AuthBrandHeader
          title="Welcome Back"
          description="Login to access your movie tickets & account"
        />

        {authError && <AuthErrorBanner message={authError} />}

        <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-4">
          <Input
            id="user-email"
            type="email"
            label="Email Address"
            placeholder="you@example.com"
            autoComplete="email"
            error={errors.email?.message}
            {...register('email')}
          />

          <Input
            id="user-password"
            type="password"
            label="Password"
            placeholder="••••••••"
            autoComplete="current-password"
            error={errors.password?.message}
            {...register('password')}
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
            <Link to="/forgot-password" className="font-medium text-brand-600 hover:underline">
              Forgot Password?
            </Link>
          </div>

          <Button
            type="submit"
            loading={isLoading}
            fullWidth
            size="md"
            className="mt-1"
          >
            Login
          </Button>
        </form>

        <AuthDivider />

        <SocialLoginButtons />

        <footer className="mt-4 text-center text-xs md:text-sm text-ink-muted">
          Don&apos;t have an account?{' '}
          <Link to="/register" className="font-medium text-brand-600 hover:underline">
            Sign Up
          </Link>
        </footer>
      </main>
    </div>
  );
}
