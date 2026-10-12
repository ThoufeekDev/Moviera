import { MovieraLogo } from '@/shared/ui/MovieraLogo';

interface AuthBrandHeaderProps {
  title: string;
  description: string;
}

export default function AuthBrandHeader({ title, description }: AuthBrandHeaderProps) {
  return (
    <header className="mb-6 flex flex-col items-center text-center">
      <MovieraLogo size="md" />

      <h2 className="mt-4 text-xl md:text-2xl font-bold tracking-tight text-ink">
        {title}
      </h2>
      <p className="mt-1 text-xs md:text-sm text-ink-muted leading-relaxed">
        {description}
      </p>
    </header>
  );
}
