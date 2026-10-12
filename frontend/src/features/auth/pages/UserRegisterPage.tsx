import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate } from 'react-router-dom';
import { Turnstile } from 'react-turnstile';

import { Button } from '@/shared/ui/Button';
import { Input } from '@/shared/ui/Input';
import { getErrorMessage } from '@/shared/lib/getErrorMessage';
import env from '@/shared/lib/env';

import AuthBrandHeader from '../components/AuthBrandHeader';
import AuthDivider from '../components/AuthDivider';
import AuthErrorBanner from '../components/AuthErrorBanner';
import SocialLoginButtons from '../components/SocialLoginButtons';

import { registerUser } from '../api/auth.api';
import { registerSchema, type RegisterFormData } from '../schemas/register.schema';

export default function UserRegisterPage() {
  const [turnstileToken, setTurnstileToken] = useState('');
  const [authError, setAuthError] = useState('');

  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
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
    <div className="min-h-dvh flex w-full items-center justify-center bg-page p-4 font-sans text-ink">
      <main className="w-full max-w-[28rem] rounded-lg border border-border bg-surface p-6 sm:p-8 shadow-card">
        <AuthBrandHeader
          title="Create Account"
          description="Sign up to get started with Moviera"
        />

        {authError && <AuthErrorBanner message={authError} />}

        <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-4">
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
              sitekey={env.turnstileSiteKey || ''}
              onVerify={(token: string) => {
                setTurnstileToken(token);
              }}
            />
          </div>

          <Button
            type="submit"
            fullWidth
            size="md"
            loading={isSubmitting}
            className="mt-1"
          >
            Create Account
          </Button>
        </form>

        <AuthDivider />

        <SocialLoginButtons />

        <p className="mt-4 text-center text-xs md:text-sm text-ink-muted">
          Already have an account?{' '}
          <Link to="/user/login" className="font-medium text-brand-600 hover:underline">
            Login
          </Link>
        </p>
      </main>
    </div>
  );
}
