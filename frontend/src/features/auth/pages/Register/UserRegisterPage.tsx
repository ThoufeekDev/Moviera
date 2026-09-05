import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate } from 'react-router-dom';
import { Turnstile } from 'react-turnstile';

import Button from '../../../../shared/components/Button/Button';
import Input from '../../../../shared/components/Input/Input';
import { getErrorMessage } from '../../../../shared/utils/getErrorMessage';

import AuthBrandHeader from '../../components/AuthBrandHeader';
import AuthDivider from '../../components/AuthDivider';
import AuthErrorBanner from '../../components/AuthErrorBanner';
import SocialLoginButtons from '../../components/SocialLoginButtons';

import { registerUser } from '../../services/auth.service';
import { registerSchema, type RegisterFormData } from '../../validators/register.schema';

import './userRegister.css';

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
    <div className="register-container">
      <div className="register-card">
        <AuthBrandHeader
          title="Create Account"
          description="Sign up to get started with Moviera"
        />

        {authError && <AuthErrorBanner message={authError} />}

        <form onSubmit={handleSubmit(onSubmit)} noValidate>
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

          <Turnstile
            sitekey={import.meta.env.VITE_TURNSTILE_SITE_KEY!}
            onVerify={(token: string) => {
              setTurnstileToken(token);
            }}
          />

          <Button type="submit" className="submit-btn">
            Create Account
          </Button>
        </form>

        <AuthDivider />

        <SocialLoginButtons />

        <p className="footer-text">
          Already have an account? <Link to="/user/login">Login</Link>
        </p>
      </div>
    </div>
  );
}
