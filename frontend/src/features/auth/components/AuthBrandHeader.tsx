import MovieraLogo from '../../../components/common/MovieraLogo/MovieraLogo';

interface AuthBrandHeaderProps {
  title: string;
  description: string;
}

export default function AuthBrandHeader({ title, description }: AuthBrandHeaderProps) {
  return (
    <header className="brand-header">
      <MovieraLogo size="md" />

      <h2>{title}</h2>
      <p>{description}</p>
    </header>
  );
}

