import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate, Link } from 'react-router-dom';
import { useState } from 'react';
import { Turnstile } from 'react-turnstile';
import { getErrorMessage } from '../../../../shared/utils/getErrorMessage';
import MovieraLogo from '../../../../components/common/MovieraLogo/MovieraLogo';
import './AdminRegister.css';

import { registerUser } from '../../../auth/services/auth.service';
import {
  hospitalRegisterSchema,
  type HospitalRegisterFormData,
} from '../../validators/hospitalRegister.schema';

export default function HospitalRegisterPage() {
  const [authError, setAuthError] = useState('');
  const [turnstileToken, setTurnstileToken] = useState('');
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<HospitalRegisterFormData>({
    resolver: zodResolver(hospitalRegisterSchema),
  });

  const onSubmit = async (data: HospitalRegisterFormData) => {
    try {
      setAuthError('');

      await registerUser({
        ...data,
        role: 'ADMIN',
        turnstileToken,
      });

      navigate('/verify-otp', {
        state: {
          email: data.email,
        },
      });
    } catch (error: any) {
      // const message = error?.response?.data?.message || "Registration failed. Please try again.";
      setAuthError(getErrorMessage(error));
    }
  };

  return (
    <div className="register-container">
      <main className="register-card">
        {/* Brand Header */}
        <header className="brand-header">
          <MovieraLogo size="md" />
          <h2>Register Cinema</h2>
          <p>Create your cinema partner admin workspace</p>
        </header>

        {/* Global Server Actions Response Error Banner (Strategic Positioning) */}
        {authError && (
          <div className="error-banner" role="alert">
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              aria-hidden="true"
              style={{ flexShrink: 0 }}
            >
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
            <span>{authError}</span>
          </div>
        )}

        {/* Form Architecture Wrapper */}
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          {/* NAME */}
          <div className="form-group">
            <label htmlFor="hosp-name">Full Name</label>
            <div className="input-wrapper">
              <input
                id="hosp-name"
                type="text"
                autoComplete="name"
                placeholder="John Doe"
                aria-invalid={errors.name ? 'true' : 'false'}
                {...register('name')}
              />
            </div>
            {errors.name && (
              <p className="error-message" id="name-error">
                {errors.name.message}
              </p>
            )}
          </div>

          {/* EMAIL */}
          <div className="form-group">
            <label htmlFor="hosp-email">Email Address</label>
            <div className="input-wrapper">
              <input
                id="hosp-email"
                type="email"
                autoComplete="email"
                placeholder="admin@cinema.com"
                aria-invalid={errors.email ? 'true' : 'false'}
                {...register('email')}
              />
            </div>
            {errors.email && (
              <p className="error-message" id="email-error">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* PASSWORD */}
          <div className="form-group">
            <label htmlFor="hosp-password">Password</label>
            <div className="input-wrapper">
              <input
                id="hosp-password"
                type="password"
                autoComplete="new-password"
                placeholder="••••••••"
                aria-invalid={errors.password ? 'true' : 'false'}
                {...register('password')}
              />
            </div>
            {errors.password && (
              <p className="error-message" id="password-error">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* CONFIRM PASSWORD */}
          <div className="form-group">
            <label htmlFor="hosp-confirmPassword">Confirm Password</label>
            <div className="input-wrapper">
              <input
                id="hosp-confirmPassword"
                type="password"
                autoComplete="new-password"
                placeholder="••••••••"
                aria-invalid={errors.confirmPassword ? 'true' : 'false'}
                {...register('confirmPassword')}
              />
            </div>
            {errors.confirmPassword && (
              <p className="error-message" id="confirmPassword-error">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          {/* TURNSTILE CAPTCHA */}
          <div className="turnstile-wrapper">
            <Turnstile
              sitekey={import.meta.env.VITE_TURNSTILE_SITE_KEY}
              onVerify={(token) => {
                setTurnstileToken(token);
              }}
            />
          </div>

          {/* EXECUTE SUBMISSION ACTION */}
          <button type="submit" className="submit-btn">
            Register Cinema
          </button>
        </form>

        {/* Global Footer Interceptor Node */}
        <footer className="footer-text">
          Already have an account?
          <Link to="/admin/login">Admin Login</Link>
        </footer>
      </main>
    </div>
  );
}
