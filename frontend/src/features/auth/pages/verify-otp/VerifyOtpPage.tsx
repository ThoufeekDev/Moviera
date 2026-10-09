import React, { useState, useRef, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../stores/auth.store';
import OtpTimer from '../../components/OtpTimer';
import AuthErrorBanner from '../../components/AuthErrorBanner';
import AuthBrandHeader from '../../components/AuthBrandHeader';
import { verifyOtpSchema, type VerifyOtpFormData } from '../../validators/verify-otp.schema';
import { Button } from '@/shared/ui/Button';
import { Role } from '@/shared/constants/Role';

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
      setOtpError(error.response?.data?.message || 'Failed to resend OTP');
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
      setOtpError(error.response?.data?.message || 'Invalid or expired verification code.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-slate-50 p-4 bg-[radial-gradient(circle_at_50%_0%,rgba(248,68,100,0.06)_0%,rgba(248,250,252,1)_75%)]">
      <div className="relative z-10 w-full max-w-[440px] max-h-[calc(100vh-2rem)] overflow-y-auto rounded-3xl border border-slate-200/80 border-t-4 border-t-brand-500 bg-white p-7 sm:p-9 text-center shadow-xl shadow-slate-900/5 animate-in fade-in zoom-in-95 duration-200">
        <AuthBrandHeader
          title="Verify your account"
          description={`We've sent a 6-digit verification code to ${email || 'your email'}`}
        />

        {otpError && <AuthErrorBanner message={otpError} />}

        {resendSuccess && (
          <div className="mb-4 flex items-center justify-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-3.5 py-2.5 text-xs font-medium text-emerald-800">
            <svg className="h-4 w-4 text-emerald-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12.5L9.5 17L19 7" />
            </svg>
            <span>{resendSuccess}</span>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-700" htmlFor="otp-0">
              Security Code
            </label>

            <div className="flex justify-center gap-2 sm:gap-3 my-2" onPaste={handlePaste}>
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
                  className={`h-12 w-11 sm:h-14 sm:w-12 rounded-xl border-2 text-center text-xl font-bold transition-all focus:outline-none focus:ring-4 ${
                    errors.otp || otpError
                      ? 'border-rose-400 bg-rose-50/50 text-rose-900 focus:border-rose-500 focus:ring-rose-500/15'
                      : digit
                      ? 'border-brand-500 bg-brand-50/30 text-slate-900 focus:border-brand-500 focus:ring-brand-500/15'
                      : 'border-slate-200 bg-slate-50 text-slate-900 focus:border-brand-500 focus:bg-white focus:ring-brand-500/15'
                  }`}
                  autoFocus={idx === 0}
                  aria-label={`Digit ${idx + 1}`}
                />
              ))}
            </div>

            {errors.otp && <p className="text-xs text-rose-500">{errors.otp.message}</p>}
          </div>

          <div className="text-xs font-medium text-slate-500">
            <OtpTimer expiresAt={otpExpireIn} />
          </div>

          <Button
            type="submit"
            fullWidth
            size="lg"
            loading={isSubmitting}
            disabled={isSubmitting || otpDigits.join('').length !== OTP_LENGTH}
            className="font-bold shadow-lg shadow-brand-500/25"
          >
            Verify & Continue
          </Button>
        </form>

        <div className="mt-6 text-xs text-slate-500">
          <p>
            Didn&apos;t receive the email?{' '}
            <button
              type="button"
              className="font-semibold text-brand-500 hover:text-brand-600 hover:underline disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={handleResentOtp}
              disabled={now < Number(otpExpireIn)}
            >
              {now < Number(otpExpireIn) ? 'please wait after 5 minutes ' : 'Resend Code'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
