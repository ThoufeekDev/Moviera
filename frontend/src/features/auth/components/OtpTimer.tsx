import { memo, useEffect, useState } from 'react';

interface OtpTimerProps {
  expiresAt: number;
}

const OtpTimer = memo(function OtpTimer({ expiresAt }: OtpTimerProps) {
  const [remaining, setRemaining] = useState(0);

  useEffect(() => {
    const calculateRemaining = () => {
      const seconds = Math.max(0, Math.ceil((expiresAt - Date.now()) / 1000));

      setRemaining(seconds);
    };

    calculateRemaining();

    const timer = setInterval(calculateRemaining, 1000);

    return () => clearInterval(timer);
  }, [expiresAt]);

  const minutes = Math.floor(remaining / 60);
  const seconds = remaining % 60;

  return (
    <div>
      {remaining > 0 ? (
        <span>
          OTP expires in {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
        </span>
      ) : (
        <span>OTP expired</span>
      )}
    </div>
  );
});

export default OtpTimer;
