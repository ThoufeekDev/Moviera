import { cn } from '@/shared/lib/cn';

interface FormErrorProps {
  message?: string;
  className?: string;
}

export default function FormError({ message, className }: FormErrorProps) {
  if (!message) return null;

  return (
    <p className={cn('mt-1 text-[0.875rem] text-danger-700 font-medium', className)}>
      {message}
    </p>
  );
}
