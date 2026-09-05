import React, { useState, useRef, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/auth.store';
import OtpTimer from '../../components/OtpTimer';
import AuthErrorBanner from '../../components/AuthErrorBanner';
import AuthBrandHeader from '../../components/AuthBrandHeader';
import { verifyOtpSchema, type VerifyOtpFormData } from '../../validators/verify-otp.schema';

import './verifyOtp.css';

const OTP_LENGTH = 6;

export default function VerifyOtpPage() {
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
    const location = useLocation();
    const navigate = useNavigate();
    const email = location.state?.email || '';
  

  const [otpDigits, setOtpDigits] = useState<string[]>(Array(OTP_LENGTH).fill(''));
  const [otpError, setOtpError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [resendSuccess, setResendSuccess] = useState('');

  const [otpExpireIn,setOtpExpireIn] = useState(location.state?.otpExpireIn || '')

  // let otpExpireIn = location.state?.otpExpireIn || '';

  const verifyOtpAndLogin = useAuthStore((state) => state.verifyOtpAndLogin);
  const resentOtp = useAuthStore((state) => state.resendOtp);
  async function handleResentOtp() {
   
    try {
       
          setResendSuccess('');
          setOtpError('');
      const response = await resentOtp({ email });

          setOtpExpireIn(response.data.otpExpireAt);
          setResendSuccess(response.message);
      
     } catch (error:any) {
       setOtpError(error.response.data?.message || 'Failed to resend OTP')
     }
  
  }

  const {
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm<VerifyOtpFormData>({
    resolver: zodResolver(verifyOtpSchema),
    defaultValues: { email, otp: '' },
  });

  // Sync segmented digits to form value
  useEffect(() => {
    const combinedOtp = otpDigits.join('');
    setValue('otp', combinedOtp, { shouldValidate: combinedOtp.length === OTP_LENGTH });
  }, [otpDigits, setValue]);

  const handleDigitChange = (value: string, index: number) => {
    const cleanVal = value.replace(/\D/g, '');
    const newDigits = [...otpDigits];

    if (!cleanVal) {
      newDigits[index] = '';
      setOtpDigits(newDigits);
      return;
    }

    newDigits[index] = cleanVal[cleanVal.length - 1];
    setOtpDigits(newDigits);
    setOtpError('');

    if (index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Backspace' && !otpDigits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, OTP_LENGTH);
    if (!pastedData) return;

    const newDigits = Array(OTP_LENGTH).fill('');
    for (let i = 0; i < pastedData.length; i++) {
      newDigits[i] = pastedData[i];
    }
    setOtpDigits(newDigits);

    const targetFocus = Math.min(pastedData.length, OTP_LENGTH - 1);
    inputRefs.current[targetFocus]?.focus();
  };

  const onSubmit = async (data: VerifyOtpFormData) => {
    try {
      setOtpError('');
      setResendSuccess('');
      setIsSubmitting(true);
      await verifyOtpAndLogin(data);

      const currentUser = useAuthStore.getState().user;
      if (!currentUser) return;

      if (currentUser.role === 'ADMIN') {
        navigate('/admin');
      } else {
        navigate('/');
      }
    } catch (error: any) {
      setOtpError(error.response?.data?.message || 'Invalid or expired verification code.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="otp-container">
      <div className="otp-background-glow" />

      <div className="otp-card">
        {/* Reusable Brand Header Component */}
        <AuthBrandHeader
          title="Verify your account"
          description={`We've sent a 6-digit verification code to ${email || 'your email'}`}
        />

        {/* Reusable Error Banner Component */}
        {otpError && <AuthErrorBanner message={otpError} />}

        {resendSuccess && (
          <div className="otp-success-message">
            <div className="success-check">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M5 12.5L9.5 17L19 7" />
              </svg>
            </div>

            <span>{resendSuccess}</span>
          </div>
        )}

        {/* Verification Form */}
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="form-group">
            <label className="otp-label" htmlFor="otp-0">
              Security Code
            </label>

            {/* 6-Digit Segmented Box Inputs */}
            <div className="otp-box-grid" onPaste={handlePaste}>
              {otpDigits.map((digit, idx) => (
                <input
                  key={idx}
                  id={`otp-${idx}`}
                  ref={(el) => {
                    inputRefs.current[idx] = el;
                  }}
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={1}
                  value={digit}
                  disabled={isSubmitting}
                  onChange={(e) => handleDigitChange(e.target.value, idx)}
                  onKeyDown={(e) => handleKeyDown(e, idx)}
                  className={`otp-digit-box ${digit ? 'filled' : ''} ${
                    errors.otp || otpError ? 'error' : ''
                  }`}
                  autoFocus={idx === 0}
                  aria-label={`Digit ${idx + 1}`}
                />
              ))}
            </div>

            {errors.otp && <p className="field-error">{errors.otp.message}</p>}
          </div>

          <div className="timer-wrapper">
            <OtpTimer expiresAt={otpExpireIn} />
          </div>

          <button
            type="submit"
            className="submit-btn"
            disabled={isSubmitting || otpDigits.join('').length !== OTP_LENGTH}
          >
            {isSubmitting ? <span className="btn-spinner" /> : 'Verify & Continue'}
          </button>
        </form>

        <div className="resend-wrapper">
          <p className="resend-text">
            Didn't receive the email?{' '}
            <button
              type="button"
              className="resend-btn"
              onClick={handleResentOtp}
              disabled={Date.now() < otpExpireIn}
            >
              {Date.now() < otpExpireIn ? 'please wait after 5 minutes ' : 'Resend Code'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
