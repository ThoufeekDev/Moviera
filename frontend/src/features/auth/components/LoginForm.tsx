import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../stores/auth.store';
import { getErrorMessage } from '@/shared/lib/getErrorMessage';
import { loginSchema, type LoginFormData } from '../schemas/login.schema';
import { Role } from '@/shared/constants/Role';

import { Button } from '@/shared/ui/Button';
import { Input } from '@/shared/ui/Input';
import AuthBrandHeader from './AuthBrandHeader';
import AuthErrorBanner from './AuthErrorBanner';
import AuthDivider from './AuthDivider';
import SocialLoginButtons from './SocialLoginButtons';

export interface LoginFormProps {
  role?: Role | 'USER';
  title: string;
  description: string;
  redirectTo: string;
  placeholderEmail?: string;
  showSocialLogin?: boolean;
  showRememberMe?: boolean;
  registerLink?: {
    prompt: string;
    label: string;
    to: string;
  };
}

const REMEMBER_KEY = 'moviera_remember_email';

export default function LoginForm({
  role = 'USER',
  title,
  description,
  redirectTo,
  placeholderEmail = 'you@example.com',
  showSocialLogin = false,
  showRememberMe = true,
  registerLink,
}: LoginFormProps) {
  const { login, isLoading } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [authError, setAuthError] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  useEffect(() => {
    const saved = localStorage.getItem(REMEMBER_KEY);
    if (saved) {
      setValue('email', saved);
      setRememberMe(true);
    }
  }, [setValue]);

  const onSubmit = async (data: LoginFormData) => {
    try {
      setAuthError('');

      if (rememberMe) {
        localStorage.setItem(REMEMBER_KEY, data.email);
      } else {
        localStorage.removeItem(REMEMBER_KEY);
      }

      await login({
        ...data,
        role,
      });

      const from = (location.state as { from?: { pathname: string; search?: string; hash?: string } })?.from;
      const targetUrl = from?.pathname && from.pathname !== location.pathname
        ? `${from.pathname}${from.search || ''}${from.hash || ''}`
        : redirectTo;

      navigate(targetUrl, { replace: true });
    } catch (error) {
      setAuthError(getErrorMessage(error));
    }
  };

  return (
    <div className="min-h-dvh flex w-full items-center justify-center bg-page p-4 font-sans text-ink">
      <main className="w-full max-w-[28rem] rounded-lg border border-border bg-surface p-6 sm:p-8 shadow-card">
        <AuthBrandHeader title={title} description={description} />

        {authError && <AuthErrorBanner message={authError} />}

        <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-4">
          <Input
            id="login-email"
            type="email"
            label="Email Address"
            placeholder={placeholderEmail}
            autoComplete="email"
            error={errors.email?.message}
            {...register('email')}
          />

          <Input
            id="login-password"
            type="password"
            label="Password"
            placeholder="••••••••"
            autoComplete="current-password"
            error={errors.password?.message}
            {...register('password')}
          />

          {showRememberMe && (
            <div className="my-1 flex items-center justify-between text-xs md:text-sm">
              <label className="inline-flex cursor-pointer select-none items-center gap-2 font-normal text-ink">
                <input
                  type="checkbox"
                  id="remember-me-check"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 rounded-sm border-border accent-brand-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-600"
                />
                Remember me
              </label>
            </div>
          )}

          <Button
            type="submit"
            loading={isLoading}
            fullWidth
            size="md"
            className="mt-1"
          >
            Sign In
          </Button>
        </form>

        {showSocialLogin && (
          <>
            <AuthDivider />
            <SocialLoginButtons />
          </>
        )}

        {registerLink && (
          <footer className="mt-4 text-center text-xs md:text-sm text-ink-muted">
            {registerLink.prompt}{' '}
            <Link to={registerLink.to} className="font-medium text-brand-600 hover:underline">
              {registerLink.label}
            </Link>
          </footer>
        )}
      </main>
    </div>
  );
}
