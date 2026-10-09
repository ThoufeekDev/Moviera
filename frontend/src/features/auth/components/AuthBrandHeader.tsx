import { MovieraLogo } from '@/shared/ui/MovieraLogo';

interface AuthBrandHeaderProps {
  title: string;
  description: string;
}

export default function AuthBrandHeader({ title, description }: AuthBrandHeaderProps) {
  return (
    <header className="mb-6 flex flex-col items-center text-center">
      <MovieraLogo size="md" />

      <h2 className="mt-4 text-2xl font-extrabold tracking-tight text-slate-900">
        {title}
      </h2>
      <p className="mt-1 text-sm text-slate-500">
        {description}
      </p>
    </header>
  );
}
