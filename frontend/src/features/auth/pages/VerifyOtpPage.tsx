import React, { useState, useRef, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/auth.store';
import OtpTimer from '../components/OtpTimer';
import AuthErrorBanner from '../components/AuthErrorBanner';
import AuthBrandHeader from '../components/AuthBrandHeader';
import { verifyOtpSchema, type VerifyOtpFormData } from '../schemas/verifyOtp.schema';
import { Button } from '@/shared/ui/Button';
import { Role } from '@/shared/constants/Role';
import { getErrorMessage } from '@/shared/lib/getErrorMessage';

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

  const [otpExpireIn, setOtpExpireIn] = useState(location.state?.otpExpireIn || '');
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);

  const verifyOtpAndLogin = useAuthStore((state) => state.verifyOtpAndLogin);
  const resentOtp = useAuthStore((state) => state.resendOtp);

  async function handleResentOtp() {
    try {
      setResendSuccess('');
      setOtpError('');
      const response = await resentOtp({ email });

      setOtpExpireIn(response.data.otpExpireAt);
      setResendSuccess(response.message);
    } catch (error: any) {
      setOtpError(getErrorMessage(error) || 'Failed to resend OTP');
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

      if (currentUser.role === Role.SUPER_ADMIN || currentUser.role === Role.THEATRE_ADMIN) {
        navigate('/admin');
      } else {
        navigate('/');
      }
    } catch (error: any) {
      setOtpError(getErrorMessage(error) || 'Invalid or expired verification code.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-dvh flex w-full items-center justify-center bg-page p-4 font-sans text-ink">
      <main className="w-full max-w-[28rem] rounded-lg border border-border bg-surface p-6 sm:p-8 text-center shadow-card">
        <AuthBrandHeader
          title="Verify your account"
          description={`We've sent a 6-digit verification code to ${email || 'your email'}`}
        />

        {otpError && <AuthErrorBanner message={otpError} />}

        {resendSuccess && (
          <div className="mb-4 flex items-center justify-center gap-2 rounded-md border border-success-500/20 bg-emerald-50 px-3.5 py-2.5 text-xs md:text-sm font-medium text-success-700" role="status">
            <svg className="h-4 w-4 shrink-0 text-success-700" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M5 12.5L9.5 17L19 7" />
            </svg>
            <span>{resendSuccess}</span>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-ink" htmlFor="otp-0">
              Security Code
            </label>

            <div className="flex justify-center gap-2 sm:gap-2.5 my-2" onPaste={handlePaste}>
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
                  className={`h-12 w-11 sm:h-12 sm:w-12 min-h-[44px] min-w-[40px] rounded-md border text-center text-xl font-bold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-600 focus-visible:ring-offset-2 ${
                    errors.otp || otpError
                      ? 'border-danger-600 bg-brand-50/50 text-danger-600'
                      : digit
                      ? 'border-brand-600 bg-surface text-ink'
                      : 'border-border bg-surface text-ink'
                  }`}
                  autoFocus={idx === 0}
                  aria-label={`Digit ${idx + 1}`}
                />
              ))}
            </div>

            {errors.otp && (
              <p className="text-xs md:text-sm font-medium text-danger-600" role="alert">
                {errors.otp.message}
              </p>
            )}
          </div>

          <div className="text-xs md:text-sm text-ink-muted">
            <OtpTimer expiresAt={otpExpireIn} />
          </div>

          <Button
            type="submit"
            fullWidth
            size="md"
            loading={isSubmitting}
            disabled={isSubmitting || otpDigits.join('').length !== OTP_LENGTH}
            className="mt-1"
          >
            Verify &amp; Continue
          </Button>
        </form>

        <div className="mt-6 text-xs md:text-sm text-ink-muted">
          <p>
            Didn&apos;t receive the code?{' '}
            <button
              type="button"
              className="font-medium text-brand-600 hover:underline disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={handleResentOtp}
              disabled={now < Number(otpExpireIn)}
            >
              {now < Number(otpExpireIn) ? 'Please wait 5 minutes' : 'Resend Code'}
            </button>
          </p>
        </div>
      </main>
    </div>
  );
}
