import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../stores/auth.store';
import { useState } from 'react';
import { getErrorMessage } from '@/shared/utils/getErrorMessage';
import { loginSchema, type LoginFormData } from '../../validators/login.schema';

// UI Kit Components
import { Button } from '@/shared/ui/Button';
import { Input } from '@/shared/ui/Input';
import AuthBrandHeader from '../../components/AuthBrandHeader';
import SocialLoginButtons from '../../components/SocialLoginButtons';
import AuthDivider from '../../components/AuthDivider';
import AuthErrorBanner from '../../components/AuthErrorBanner';

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
    <div className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-slate-50 p-4 bg-[radial-gradient(circle_at_50%_0%,rgba(248,68,100,0.06)_0%,rgba(248,250,252,1)_75%)]">
      <main className="relative z-10 w-full max-w-[420px] max-h-[calc(100vh-2rem)] overflow-y-auto rounded-3xl border border-slate-200/80 border-t-4 border-t-brand-500 bg-white p-7 sm:p-9 shadow-xl shadow-slate-900/5 animate-in fade-in zoom-in-95 duration-200">
        <div className="text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-brand-500/20 bg-brand-500/10 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-brand-500 mb-4">
            <span className="h-1.5 w-1.5 rounded-full bg-brand-500 shadow-[0_0_8px_rgba(248,68,100,0.8)]" />
            Movie Ticket Booking
          </span>
        </div>

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

          <div className="my-1 flex items-center justify-between text-xs">
            <label className="inline-flex cursor-pointer select-none items-center gap-2 font-medium text-slate-600">
              <input
                type="checkbox"
                id="remember-me-check"
                className="h-4 w-4 rounded border-slate-300 text-brand-500 accent-brand-500 focus:ring-brand-500"
              />
              Remember me
            </label>
            <Link to="/forgot-password" className="font-semibold text-brand-500 hover:text-brand-600 hover:underline">
              Forgot Password?
            </Link>
          </div>

          <Button type="submit" loading={isLoading} fullWidth size="lg" className="mt-1 font-bold shadow-lg shadow-brand-500/25">
            Login
          </Button>
        </form>

        <AuthDivider />

        <SocialLoginButtons />

        <footer className="text-center text-xs text-slate-500">
          Don&apos;t have an account?{' '}
          <Link to="/register" className="font-semibold text-brand-500 hover:text-brand-600 hover:underline">
            Sign Up
          </Link>
        </footer>
      </main>
    </div>
  );
}
