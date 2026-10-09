import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate } from 'react-router-dom';
import { Turnstile } from 'react-turnstile';

import { Button } from '@/shared/ui/Button';
import { Input } from '@/shared/ui/Input';
import { getErrorMessage } from '@/shared/utils/getErrorMessage';

import AuthBrandHeader from '../../components/AuthBrandHeader';
import AuthDivider from '../../components/AuthDivider';
import AuthErrorBanner from '../../components/AuthErrorBanner';
import SocialLoginButtons from '../../components/SocialLoginButtons';

import { registerUser } from '../../services/auth.service';
import { registerSchema, type RegisterFormData } from '../../validators/register.schema';

export default function UserRegisterPage() {
  const [turnstileToken, setTurnstileToken] = useState('');
  const [authError, setAuthError] = useState('');

  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    try {
      setAuthError('');

      const response = await registerUser({
        ...data,
        role: 'USER',
        turnstileToken,
      });

      navigate('/verify-otp', {
        state: {
          email: data.email,
          otpExpireIn: response.otpExpireIn,
        },
      });
    } catch (error) {
      setAuthError(getErrorMessage(error));
    }
  };

  return (
    <div className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-slate-50 p-4 bg-[radial-gradient(circle_at_50%_0%,rgba(248,68,100,0.06)_0%,rgba(248,250,252,1)_75%)]">
      <div className="relative z-10 w-full max-w-[440px] max-h-[calc(100vh-2rem)] overflow-y-auto rounded-3xl border border-slate-200/80 border-t-4 border-t-brand-500 bg-white p-7 sm:p-9 shadow-xl shadow-slate-900/5 animate-in fade-in zoom-in-95 duration-200">
        <AuthBrandHeader
          title="Create Account"
          description="Sign up to get started with Moviera"
        />

        {authError && <AuthErrorBanner message={authError} />}

        <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-3.5">
          <Input
            id="name"
            label="Full Name"
            type="text"
            placeholder="John Doe"
            error={errors.name?.message}
            {...register('name')}
          />

          <Input
            id="email"
            label="Email Address"
            type="email"
            placeholder="you@example.com"
            autoComplete="email"
            error={errors.email?.message}
            {...register('email')}
          />

          <Input
            id="password"
            label="Password"
            type="password"
            placeholder="••••••••"
            autoComplete="new-password"
            error={errors.password?.message}
            {...register('password')}
          />

          <Input
            id="confirmPassword"
            label="Confirm Password"
            type="password"
            placeholder="••••••••"
            autoComplete="new-password"
            error={errors.confirmPassword?.message}
            {...register('confirmPassword')}
          />

          <div className="flex justify-center my-1">
            <Turnstile
              sitekey={import.meta.env.VITE_TURNSTILE_SITE_KEY!}
              onVerify={(token: string) => {
                setTurnstileToken(token);
              }}
            />
          </div>

          <Button type="submit" fullWidth size="lg" className="mt-1 font-bold shadow-lg shadow-brand-500/25">
            Create Account
          </Button>
        </form>

        <AuthDivider />

        <SocialLoginButtons />

        <p className="text-center text-xs text-slate-500">
          Already have an account?{' '}
          <Link to="/user/login" className="font-semibold text-brand-500 hover:text-brand-600 hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
